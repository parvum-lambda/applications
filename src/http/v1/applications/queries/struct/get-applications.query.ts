import { Applications } from '.prisma/client';
import { BindingMap } from '../../../../../decorators/model-binding.decorator';

@BindingMap('application')
export class GetApplicationsQuery {
  constructor(
    public readonly id: Applications['id'],
    public readonly flags: number,
  ) {}
}
