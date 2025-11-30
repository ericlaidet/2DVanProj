// apps/api/src/ai/interceptors/ai-usage.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

/**
 * Interceptor léger pour logger les usages IA.
 * N'utilise pas d'opérateurs rxjs pour éviter une dépendance explicite ici.
 */
@Injectable()
export class AIUsageInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AIUsageInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const endpoint = request.route?.path ?? 'unknown';
    const start = Date.now();

    // on récupère l'observable retourné par la route
    const observable = next.handle();

    // si l'observable possède subscribe (standard Rx), on s'y abonne pour logger
    try {
      // @ts-ignore - runtime check for subscribe
      const sub = observable?.subscribe?.({
        next: async (data: any) => {
          const duration = Date.now() - start;
          this.logger.log(`AI Request - User: ${userId}, Endpoint: ${endpoint}, Duration: ${duration}ms`);

          if (userId && data?.usage) {
            try {
              await this.prisma.aIUsage.create({
                data: {
                  userId,
                  action: this.getActionFromEndpoint(endpoint),
                  tokens: data.usage.total_tokens ?? 0,
                  cost: (data.usage.total_tokens ?? 0) * 0.00002,
                },
              });
            } catch (e) {
              this.logger.debug('AIUsage tracking skipped (table missing or error)');
            }
          }
        },
        error: (err: any) => {
          const duration = Date.now() - start;
          const msg = (err && err.message) ? err.message : String(err);
          this.logger.error(`AI Request Failed - User: ${userId}, Endpoint: ${endpoint}, Duration: ${duration}ms, Error: ${msg}`);
        },
      });

      // if subscribe returned a subscription, we don't need to store it here
      // continue returning the original observable so Nest can handle it
      return observable;
    } catch (err) {
      // if any runtime issue, just return observable to keep behavior
      this.logger.debug('AIUsageInterceptor subscribe failed - proceeding without DB logging');
      return observable;
    }
  }

  private getActionFromEndpoint(endpoint: string): string {
    if (endpoint.includes('generate-layout')) return 'generate_layout';
    if (endpoint.includes('optimize-plan')) return 'optimize_plan';
    if (endpoint.includes('preferences')) return 'analyze_preferences';
    return 'unknown';
  }
}

