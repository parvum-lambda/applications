import { Applications } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class GetApplicationResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Application record id',
  })
  id: Applications['id'];

  @ApiProperty({
    type: 'string',
    description: 'Application name',
  })
  name: Applications['name'];

  @ApiProperty({
    type: 'string',
    description: 'Public application id to be used during requests',
  })
  appId: Applications['appId'];

  @ApiProperty({
    type: 'string',
    description: 'Private application key to be used during protected requests',
  })
  appKey: Applications['appKey'];

  @ApiProperty({
    type: 'string',
    description: 'Application creation timestamp',
  })
  createdAt: Applications['createdAt'];

  @ApiProperty({
    type: 'string',
    description: 'Application updated timestamp',
  })
  updatedAt: Applications['updatedAt'];
}
