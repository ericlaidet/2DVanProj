// apps/api/src/ai/dto/generate-layout.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PreferencesDto {
  @IsOptional()
  @IsInt()
  sleepingCapacity?: number;

  @IsOptional()
  @IsBoolean()
  hasCooking?: boolean;

  @IsOptional()
  @IsBoolean()
  hasStorage?: boolean;

  @IsOptional()
  @IsEnum(['minimalist', 'rustic', 'modern'])
  style?: 'minimalist' | 'rustic' | 'modern';
}

export class GenerateLayoutDto {
  @IsString()
  @IsNotEmpty()
  vanType!: string;

  @IsString()
  @IsNotEmpty()
  userDescription!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto;
}
