import 'reflect-metadata';
import { plural } from 'pluralize';
import {
  DynamicModule,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import Constructable = jest.Constructable;
import { ModelBindingsService } from '../modules/model-bindings/model-bindings.service';

export enum Flags {
  WITH_DELETED = 1 << 0,
}
export interface ClassDecoratorHandler {
  (target: object): void;
}

export interface MethodDecoratorHandler {
  (target: object, propertyKey: string, descriptor: PropertyDescriptor): void;
}

export function BindingMap(alias: string): ClassDecoratorHandler {
  return function (target: object) {
    ModelBindingsService.addModelQueryBinding(alias, target);
  };
}

export function UseModelBindings(): ClassDecoratorHandler {
  return function (target: DynamicModule) {
    ModelBindingsService.addModelBindingsDependencyList(target);
  };
}

export function ModelBinding<T>(flags: Flags = 0): MethodDecoratorHandler {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const paramTypes = Reflect.getMetadata(
      'design:paramtypes',
      target,
      propertyKey,
    );

    const originalFn = descriptor.value;

    descriptor.value = async function (this: T, ...args) {
      const paramsDtoIndex = paramTypes.findIndex((param) =>
        param?.name.endsWith('ParamsDto'),
      );
      const paramsDto = args[paramsDtoIndex];

      const properties = Object.keys(paramsDto).filter(
        (property) =>
          ModelBindingsService.getModelQueryBinding(property) ||
          ModelBindingsService.getModelQueryBinding(plural(property)),
      );

      if (!properties.length) {
        throw new InternalServerErrorException(
          'No property map found for: ' + Object.keys(paramsDto).join(', '),
        );
      }

      for (const property of properties) {
        const query = (ModelBindingsService.getModelQueryBinding(property) ||
          ModelBindingsService.getModelQueryBinding(
            plural(property),
          )) as unknown as Constructable;

        const id = paramsDto[property];

        paramsDto[property] =
          await ModelBindingsService.instance().queryBus.execute(
            new query(id, flags),
          );

        if (!paramsDto[property]) {
          throw new NotFoundException();
        }
      }

      args[paramsDtoIndex] = paramsDto;

      return originalFn.call(this, ...args);
    };
  };
}
