// apps/api/src/ai/guards/ai-pro2-subscription.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AIPro2SubscriptionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const allowedSubscriptions = ['PRO2', 'PRO3'];

    if (!allowedSubscriptions.includes(user.subscription)) {
      throw new ForbiddenException(
        `AI optimization feature requires PRO2 or PRO3 subscription. Current: ${user.subscription}`,
      );
    }

    return true;
  }
}
