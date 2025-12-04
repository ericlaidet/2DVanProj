// apps/api/src/ai/services/ai.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { OpenAIClient } from './openai.client';
import { PrismaService } from '../../prisma.service';
import { AICacheService } from './ai-cache.service';
import { GenerateLayoutDto } from '../dto/generate-layout.dto';
import { OptimizePlanDto } from '../dto/optimize-plan.dto';
import { LayoutSuggestion } from '../types/ai.types';
import { generateLayoutPrompt } from '../prompts/layout-generator.prompt';
import { optimizeLayoutPrompt } from '../prompts/design-optimizer.prompt';
import { VanType } from '@prisma/client';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(
    private readonly openaiClient: OpenAIClient,
    private readonly prisma: PrismaService,
    private readonly cache: AICacheService,
  ) { }

  async generateLayout(dto: GenerateLayoutDto, userId: number): Promise<LayoutSuggestion> {
    this.logger.log(`Generate layout for user ${userId}, van: ${dto.vanType}`);

    const cacheKey = this.getCacheKey('generate', dto);
    const cached = await this.cache.get<LayoutSuggestion>(cacheKey);
    if (cached) {
      this.logger.log('Returning cached layout');
      return cached;
    }

    const van = await this.prisma.van.findUnique({
      where: { vanType: dto.vanType as VanType },
    });

    if (!van) {
      throw new BadRequestException(`Van type "${dto.vanType}" not found`);
    }

    const prompt = generateLayoutPrompt(dto.userDescription, dto.preferences, van, dto.existingLayout);

    try {
      const completion: any = await this.openaiClient.createCompletion({
        /* model: 'gpt-4-turbo-preview',*/
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en aménagement de vans. Génère des layouts optimisés en JSON.
Van dimensions: longueur=${van.length}mm, largeur=${van.width}mm.
Réponds UNIQUEMENT en JSON valide.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      // protective parsing
      //      const raw = completion?.choices?.[0]?.message?.content ?? '{}';
      //      const result = JSON.parse(raw);

      const raw = completion?.choices?.[0]?.message?.content ?? '{}';

      // 🧠 DEBUG LOG pour suivre le contenu brut
      this.logger.warn('🧠 RAW OpenAI response:', raw);

      let result: any;
      try {
        result = JSON.parse(raw);
      } catch (err) {
        this.logger.error('❌ JSON parse error:', (err as any)?.message);
        // Tentative de récupération d'un JSON partiel
        const fixed = raw
          .replace(/,\s*([\]}])/g, '$1') // supprime les virgules finales
          .replace(/(\w+):/g, '"$1":') // force les clés à être entre guillemets
          .replace(/[\r\n]/g, ' '); // nettoie les retours
        try {
          result = JSON.parse(fixed);
          this.logger.warn('✅ Recovered JSON after minor fixes.');
        } catch {
          throw new BadRequestException('Invalid JSON from OpenAI (see raw output above).');
        }
      }

      // 🔧 Auto-réparation des champs manquants
      if (!result.layout || !Array.isArray(result.layout)) {
        this.logger.warn('⚠️ Missing layout array, auto-fixing with empty one.');
        result.layout = [];
      }
      if (typeof result.explanation !== 'string') {
        this.logger.warn('⚠️ Missing explanation, setting default.');
        result.explanation = 'Aucune explication fournie.';
      }
      if (!Array.isArray(result.alternatives) && !Array.isArray(result.improvements)) {
        this.logger.warn('⚠️ Missing alternatives/improvements, setting default.');
        result.alternatives = ['Option alternative non spécifiée'];
      }

      result.layout = result.layout.map((item: any, i: number) => ({
        type: item.type ?? 'unknown',
        x: Number(item.x ?? 0),
        y: Number(item.y ?? 0),
        width: Number(item.width ?? 100),
        height: Number(item.height ?? 100),
        color: item.color ?? 'gray',
      }));

      // 🔍 Validation finale
      this.validateLayoutSuggestion(result);



      this.validateLayoutSuggestion(result);

      await this.cache.set(cacheKey, result, 86400);
      await this.logAIUsage(userId, 'generate_layout', completion?.usage ?? null);

      return result as LayoutSuggestion;
    } catch (err: unknown) {
      const message = (err as any)?.message ?? String(err);
      this.logger.error('OpenAI error:', err as any);
      throw new BadRequestException('Failed to generate layout: ' + message);
    }
  }

  async optimizePlan(dto: OptimizePlanDto, userId: number): Promise<LayoutSuggestion> {
    this.logger.log(`Optimize plan ${dto.planId} for user ${userId}`);

    const plan = await this.prisma.plan.findFirst({
      where: { id: dto.planId, userId },
      include: { planVans: { include: { van: true } } },
    });

    if (!plan) {
      throw new BadRequestException('Plan not found or unauthorized');
    }

    const van = plan.planVans[0]?.van;
    if (!van) {
      throw new BadRequestException('No van associated with this plan');
    }

    const prompt = optimizeLayoutPrompt(plan.jsonData as any[], van);

    try {
      const completion: any = await this.openaiClient.createCompletion({
        /* model: 'gpt-4-turbo-preview',*/
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'Tu es un expert en aménagement de vans.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        response_format: { type: 'json_object' },
      });

      // const raw = completion?.choices?.[0]?.message?.content ?? '{}';
      // const result = JSON.parse(raw);

      const raw = completion?.choices?.[0]?.message?.content ?? '{}';

      // 🧠 DEBUG LOG pour suivre le contenu brut
      this.logger.warn('🧠 RAW OpenAI response:', raw);

      let result: any;
      try {
        result = JSON.parse(raw);
      } catch (err) {
        this.logger.error('❌ JSON parse error:', (err as any)?.message);
        // Tentative de récupération d'un JSON partiel
        const fixed = raw
          .replace(/,\s*([\]}])/g, '$1') // supprime les virgules finales
          .replace(/(\w+):/g, '"$1":') // force les clés à être entre guillemets
          .replace(/[\r\n]/g, ' '); // nettoie les retours
        try {
          result = JSON.parse(fixed);
          this.logger.warn('✅ Recovered JSON after minor fixes.');
        } catch {
          throw new BadRequestException('Invalid JSON from OpenAI (see raw output above).');
        }
      }

      // 🔧 Auto-réparation des champs manquants
      if (!result.layout || !Array.isArray(result.layout)) {
        this.logger.warn('⚠️ Missing layout array, auto-fixing with empty one.');
        result.layout = [];
      }
      if (typeof result.explanation !== 'string') {
        this.logger.warn('⚠️ Missing explanation, setting default.');
        result.explanation = 'Aucune explication fournie.';
      }
      if (!Array.isArray(result.alternatives) && !Array.isArray(result.improvements)) {
        this.logger.warn('⚠️ Missing alternatives/improvements, setting default.');
        result.alternatives = ['Option alternative non spécifiée'];
      }

      result.layout = result.layout.map((item: any, i: number) => ({
        type: item.type ?? 'unknown',
        x: Number(item.x ?? 0),
        y: Number(item.y ?? 0),
        width: Number(item.width ?? 100),
        height: Number(item.height ?? 100),
        color: item.color ?? 'gray',
      }));

      // 🔍 Validation finale
      this.validateLayoutSuggestion(result);


      this.validateLayoutSuggestion(result);
      await this.logAIUsage(userId, 'optimize_plan', completion?.usage ?? null);

      return result as LayoutSuggestion;
    } catch (err: unknown) {
      const message = (err as any)?.message ?? String(err);
      this.logger.error('Optimization error:', err as any);
      throw new BadRequestException('Failed to optimize plan: ' + message);
    }
  }

  async analyzeUserPreferences(userId: number): Promise<any> {
    this.logger.log(`Analyze preferences for user ${userId}`);

    const userPlans = await this.prisma.plan.findMany({
      where: { userId },
      include: { planVans: { include: { van: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (userPlans.length === 0) {
      return { message: 'Pas encore assez de données pour analyser vos préférences' };
    }

    const prompt = `
Analyse ces ${userPlans.length} plans créés par l'utilisateur et identifie ses préférences:

${userPlans
        .map(
          (plan, i) => `
Plan ${i + 1}:
- Van: ${plan.planVans[0]?.van?.displayName}
- Layout: ${JSON.stringify(plan.jsonData)}
`,
        )
        .join('\n')}

Identifie:
1. Style préféré (minimaliste, confortable, etc.)
2. Priorités (cuisine, rangement, lit grand, etc.)
3. Patterns de placement (où place-t-il généralement le lit, la cuisine)

Réponds en JSON:
{
  "style": "description du style",
  "priorities": ["priorité 1", "priorité 2"],
  "patterns": { "bed": "description", "kitchen": "description" },
  "recommendations": "Suggestions pour futurs plans"
}`;

    try {
      const completion: any = await this.openaiClient.createCompletion({
        model: 'gpt-4.1-mini',
        /* model: 'gpt-4-turbo-preview', */
        messages: [
          { role: 'system', content: 'Tu es un analyste de préférences utilisateur.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      await this.logAIUsage(userId, 'analyze_preferences', completion?.usage ?? null);

      const raw = completion?.choices?.[0]?.message?.content ?? '{}';
      return JSON.parse(raw);
    } catch (err: unknown) {
      this.logger.error('Analysis error:', err as any);
      throw new BadRequestException('Failed to analyze preferences');
    }
  }

  private validateLayoutSuggestion(data: any): void {
    if (!data || !data.layout || !Array.isArray(data.layout)) {
      throw new BadRequestException('Invalid AI response: missing layout array');
    }

    if (!data.explanation || typeof data.explanation !== 'string') {
      throw new BadRequestException('Invalid AI response: missing explanation');
    }

    data.layout.forEach((item: any, index: number) => {
      const required = ['type', 'x', 'y', 'width', 'height', 'color'];
      required.forEach((field) => {
        if (!(field in item)) {
          throw new BadRequestException(
            `Invalid layout item ${index}: missing field "${field}"`,
          );
        }
      });
    });
  }

  private getCacheKey(action: string, dto: any): string {
    return `ai:${action}:${JSON.stringify(dto)}`;
  }

  private async logAIUsage(userId: number, action: string, usage: any): Promise<void> {
    try {
      const tokens = usage?.total_tokens ?? 0;
      this.logger.log(`AI Usage - User ${userId}, Action: ${action}, Tokens: ${tokens}`);

      // attempt to persist, but protected
      await this.prisma.aIUsage.create({
        data: {
          userId,
          action,
          tokens,
          cost: tokens * 0.00002,
        },
      });
    } catch (err) {
      // ignore persistence errors (missing table etc.)
      this.logger.debug('AI usage persistence skipped: ' + ((err as any)?.message ?? String(err)));
    }
  }
}

