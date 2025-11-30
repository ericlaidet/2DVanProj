// apps/api/src/ai/dto/optimize-plan.dto.ts
import { IsNumber, IsNotEmpty } from 'class-validator';

export class OptimizePlanDto {
  @IsNumber()
  @IsNotEmpty()
  planId!: number;
}
