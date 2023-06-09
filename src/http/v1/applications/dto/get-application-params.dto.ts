import { IsUUID } from '../../../../decorators/is-uuid.decorator';
import { Applications } from '@prisma/client';

export class GetApplicationParamsDto {
  @IsUUID()
  application: Applications;
}
