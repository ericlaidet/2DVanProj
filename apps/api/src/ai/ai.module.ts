// apps/api/src/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { AIService } from './services/ai.service';
import { AIController } from './controllers/ai.controller';
import { PrismaService } from '../prisma.service';
import { AICacheService } from './services/ai-cache.service';
import { OpenAIClient } from './services/openai.client';
import { AISubscriptionGuard } from './guards/ai-subscription.guard'; // ✅ AJOUT
import { AIPro2SubscriptionGuard } from './guards/ai-pro2-subscription.guard'; // ✅ AJOUT

@Module({
  controllers: [AIController],
  providers: [
    AIService,
    PrismaService,
    AICacheService,
    OpenAIClient,
    AISubscriptionGuard,      // ✅ AJOUT - Guard PRO1+
    AIPro2SubscriptionGuard,  // ✅ AJOUT - Guard PRO2+
  ],
  exports: [AIService],
})
export class AIModule {}
