// apps/api/src/ai/services/ai-cache.service.ts
import { Injectable, Logger } from '@nestjs/common';

/**
 * Service de cache simple en mémoire pour les réponses IA
 * En production, utiliser Redis pour un cache distribué
 */
@Injectable()
export class AICacheService {
  private readonly logger = new Logger(AICacheService.name);
  private readonly cache = new Map<string, { data: any; expiresAt: number }>();
  private readonly cleanupInterval = 60000; // 1 minute

  constructor() {
    // Nettoyage automatique toutes les minutes
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  /**
   * Récupérer une valeur du cache
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Vérifier expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.logger.debug(`Cache expired: ${key}`);
      return null;
    }

    this.logger.debug(`Cache hit: ${key}`);
    return entry.data as T;
  }

  /**
   * Stocker une valeur dans le cache
   * @param key Clé unique
   * @param data Données à cacher
   * @param ttl Time-to-live en secondes (défaut: 1h)
   */
  async set(key: string, data: any, ttl: number = 3600): Promise<void> {
    const expiresAt = Date.now() + ttl * 1000;
    this.cache.set(key, { data, expiresAt });
    this.logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
  }

  /**
   * Supprimer une entrée
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.logger.debug(`Cache deleted: ${key}`);
  }

  /**
   * Vider tout le cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.logger.log('Cache cleared');
  }

  /**
   * Obtenir stats du cache
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Nettoyage automatique des entrées expirées
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.debug(`Cleaned ${cleaned} expired cache entries`);
    }
  }
}

/**
 * Alternative avec Redis (pour production)
 * 
 * import { Injectable } from '@nestjs/common';
 * import { Redis } from 'ioredis';
 * 
 * @Injectable()
 * export class AICacheService {
 *   private readonly redis: Redis;
 * 
 *   constructor() {
 *     this.redis = new Redis({
 *       host: process.env.REDIS_HOST || 'localhost',
 *       port: parseInt(process.env.REDIS_PORT || '6379'),
 *     });
 *   }
 * 
 *   async get<T>(key: string): Promise<T | null> {
 *     const data = await this.redis.get(key);
 *     return data ? JSON.parse(data) : null;
 *   }
 * 
 *   async set(key: string, data: any, ttl: number = 3600): Promise<void> {
 *     await this.redis.setex(key, ttl, JSON.stringify(data));
 *   }
 * 
 *   async delete(key: string): Promise<void> {
 *     await this.redis.del(key);
 *   }
 * }
 */
