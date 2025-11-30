import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VanType } from '@prisma/client';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  jsonData!: any[];

  @IsArray()
  @IsEnum(VanType, { each: true })
  vanTypes!: VanType[];
}
