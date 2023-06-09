import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Application id',
  })
  public readonly id: string;
}
