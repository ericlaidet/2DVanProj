// apps/api/src/ai/guards/ai-subscription.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SubscriptionType } from '@prisma/client';

/**
 * Guard pour vérifier si l'utilisateur a un abonnement
 * suffisant pour utiliser les fonctionnalités IA
 */
@Injectable()
export class AISubscriptionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // Récupérer l'abonnement utilisateur
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { subscription: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Vérifier si l'abonnement permet l'accès IA
    const allowedSubscriptions: SubscriptionType[] = [
      SubscriptionType.PRO1,
      SubscriptionType.PRO2,
      SubscriptionType.PRO3,
    ];

    if (!allowedSubscriptions.includes(user.subscription)) {
      throw new ForbiddenException(
        `AI features require PRO subscription. Current: ${user.subscription}`,
      );
    }

    // Optionnel : vérifier quota d'usage IA
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Exemple : compter les appels IA du jour
    // const usage = await this.prisma.aIUsage.count({
    //   where: {
    //     userId,
    //     createdAt: { gte: today },
    //   },
    // });

    // const maxDaily = this.getMaxDailyRequests(user.subscription);
    // if (usage >= maxDaily) {
    //   throw new ForbiddenException(
    //     `Daily AI request limit reached (${maxDaily}). Upgrade to PRO3 for unlimited.`,
    //   );
    // }

    return true;
  }

  /**
   * Limites quotidiennes par abonnement
   */
  private getMaxDailyRequests(subscription: SubscriptionType): number {
    const limits: Record<SubscriptionType, number> = {
      [SubscriptionType.FREE]: 0,
      [SubscriptionType.PRO1]: 3,
      [SubscriptionType.PRO2]: 20,
      [SubscriptionType.PRO3]: Infinity,
    };

    return limits[subscription];
  }
}
