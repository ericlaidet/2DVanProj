// apps/api/src/ai/services/openai.client.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

/**
 * Wrapper simple autour du client OpenAI.
 * Utilise des types permissifs (any) pour éviter les incompatibilités
 * entre versions de la lib OpenAI et les types attendus ici.
 */
@Injectable()
export class OpenAIClient {
  private readonly logger = new Logger(OpenAIClient.name);
  private readonly client: any;
  private readonly maxRetries = 3;
  private readonly timeout = 60000;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      this.logger.warn('⚠️ OPENAI_API_KEY not found - AI features limited');
    }

    this.client = new OpenAI({
      apiKey: apiKey ?? 'dummy-key',
      timeout: this.timeout,
      maxRetries: this.maxRetries,
    });
  }

  /**
   * createCompletion accepts a flexible params object and returns any.
   * This avoids strict coupling aux types qui varient selon versions openai.
   */
  async createCompletion(params: any): Promise<any> {
    this.ensureAPIKey();

    try {
      this.logger.debug(`OpenAI request: model=${params.model}, messages=${(params.messages?.length ?? 0)}`);

      const start = Date.now();
      const completion = await this.client.chat.completions.create(params);
      const duration = Date.now() - start;

      const tokens = completion?.usage?.total_tokens ?? 0;
      this.logger.log(`✅ OpenAI response: ${tokens} tokens in ${duration}ms`);

      return completion;
    } catch (err: any) {
      this.logger.error('❌ OpenAI API error:', err?.message ?? err);
      throw this.handleOpenAIError(err);
    }
  }

  private ensureAPIKey(): void {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey || apiKey === 'dummy-key') {
      throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY in .env');
    }
  }

  private handleOpenAIError(error: any): Error {
    if (!error) return new Error('Unknown OpenAI error');

    const status = error?.status ?? error?.statusCode ?? null;

    if (status === 429) return new Error('OpenAI rate limit exceeded. Please try again later.');
    if (status === 401) return new Error('Invalid OpenAI API key');
    if (status === 500 || status === 503) return new Error('OpenAI service error. Please try again.');

    return new Error(error?.message ?? 'Unknown OpenAI error');
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.createCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5,
      });
      return true;
    } catch {
      return false;
    }
  }
}

