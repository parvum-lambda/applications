import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Application id',
  })
  public readonly id: string;
}
