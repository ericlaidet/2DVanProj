// apps/api/src/ai/controllers/ai.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AIService } from '../services/ai.service';
import { GenerateLayoutDto } from '../dto/generate-layout.dto';
import { OptimizePlanDto } from '../dto/optimize-plan.dto';
import { AISubscriptionGuard } from '../guards/ai-subscription.guard';
import { AIPro2SubscriptionGuard } from '../guards/ai-pro2-subscription.guard'; // ✅ NOUVEAU

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  /**
   * POST /ai/generate-layout
   * Génère un layout de van basé sur description utilisateur
   * Nécessite abonnement PRO1+
   */
  @Post('generate-layout')
  @UseGuards(AISubscriptionGuard)
  @HttpCode(HttpStatus.OK)
  async generateLayout(@Request() req: any, @Body() dto: GenerateLayoutDto) {
    return this.aiService.generateLayout(dto, req.user.id);
  }

  /**
   * POST /ai/optimize-plan
   * Optimise un plan existant
   * Nécessite abonnement PRO2+ ✅ CHANGÉ
   */
  @Post('optimize-plan')
  @UseGuards(AIPro2SubscriptionGuard) // ✅ GUARD SPÉCIFIQUE PRO2+
  @HttpCode(HttpStatus.OK)
  async optimizePlan(@Request() req: any, @Body() dto: OptimizePlanDto) {
    return this.aiService.optimizePlan(dto, req.user.id);
  }

  /**
   * GET /ai/preferences
   * Analyse les préférences utilisateur depuis l'historique
   */
  @Get('preferences')
  @HttpCode(HttpStatus.OK)
  async analyzePreferences(@Request() req: any) {
    return this.aiService.analyzeUserPreferences(req.user.id);
  }

  /**
   * GET /ai/health
   * Vérifier le statut du service IA
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  async health() {
    return {
      status: 'ok',
      service: 'ai',
      timestamp: new Date().toISOString(),
    };
  }
}
