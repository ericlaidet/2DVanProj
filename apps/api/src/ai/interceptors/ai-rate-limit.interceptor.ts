// apps/api/src/ai/interceptors/ai-rate-limit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma.service';
import { SubscriptionType } from '@prisma/client';

/**
 * Interceptor pour limiter les requêtes IA par abonnement
 */
@Injectable()
export class AIRateLimitInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AIRateLimitInterceptor.name);

  // Limites quotidiennes par abonnement
  private readonly DAILY_LIMITS: Record<SubscriptionType, number> = {
    [SubscriptionType.FREE]: 0,
    [SubscriptionType.PRO1]: 3,
    [SubscriptionType.PRO2]: 20,
    [SubscriptionType.PRO3]: 999999,  // illimité
  };

  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    // Récupérer l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { subscription: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Vérifier le quota
    const limit = this.DAILY_LIMITS[user.subscription];
    
    if (limit === 0) {
      throw new BadRequestException(
        'AI features not available with FREE subscription',
      );
    }

    if (limit < 999999) {
      // Compter les usages du jour
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        const usageCount = await this.prisma.aIUsage.count({
          where: {
            userId,
            createdAt: { gte: today },
          },
        });

        if (usageCount >= limit) {
          throw new BadRequestException(
            `Daily AI request limit reached (${limit}/${limit}). Upgrade to PRO3 for unlimited access.`,
          );
        }

        this.logger.log(
          `AI Rate Limit - User ${userId}: ${usageCount + 1}/${limit} requests today`,
        );
      } catch (error) {
        // Si table AIUsage n'existe pas, ignorer le rate limiting
        this.logger.warn('AIUsage table not found, skipping rate limiting');
      }
    }

    return next.handle();
  }
}
