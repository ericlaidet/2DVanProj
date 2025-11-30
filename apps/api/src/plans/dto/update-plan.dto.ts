import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { VanType } from '@prisma/client';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  jsonData?: any[];

  @IsOptional()
  @IsArray()
  @IsEnum(VanType, { each: true })
  vanTypes?: VanType[];
}
