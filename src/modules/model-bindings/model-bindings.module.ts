import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ModelBindingsService } from './model-bindings.service';

@Global()
@Module({
  imports: [
    CqrsModule,
    ...ModelBindingsService.getModelBindingsDependencyList(),
  ],
  providers: [ModelBindingsService],
})
export class ModelBindingModule {}
