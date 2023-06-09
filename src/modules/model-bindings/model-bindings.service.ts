import { DynamicModule, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class ModelBindingsService {
  private static readonly modelQueryBindingMap = new Map<
    string,
    IQueryHandler
  >();
  private static modelBindingsServiceInstance: ModelBindingsService;
  private static modelBindingsDependencyList: DynamicModule[] = [];
  constructor(public readonly queryBus: QueryBus) {
    ModelBindingsService.modelBindingsServiceInstance = this;
  }

  public static instance(): ModelBindingsService {
    return ModelBindingsService.modelBindingsServiceInstance;
  }
  public static addModelQueryBinding(model: string, queryHandler: any): void {
    ModelBindingsService.modelQueryBindingMap.set(model, queryHandler);
  }

  public static getModelQueryBinding(model: string): IQueryHandler {
    return ModelBindingsService.modelQueryBindingMap.get(model);
  }

  public static addModelBindingsDependencyList(provider: DynamicModule) {
    ModelBindingsService.modelBindingsDependencyList.push(provider);
  }

  public static getModelBindingsDependencyList(): DynamicModule[] {
    return ModelBindingsService.modelBindingsDependencyList;
  }
}
