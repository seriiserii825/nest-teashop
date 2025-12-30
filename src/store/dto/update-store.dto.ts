import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreDto } from './create-store.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @ApiProperty({
    description: 'Description of the store',
    example: 'This is an updated description for my awesome store',
  })
  @IsString()
  description: string;
}
