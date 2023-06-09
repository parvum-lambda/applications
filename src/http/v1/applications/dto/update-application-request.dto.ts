import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationRequestDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Application name',
  })
  public readonly name: string;
}
