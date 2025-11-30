/*
Même si simple, indiquer que Prisma est le client DB, et qu’il est injecté partout via constructor(private prisma: PrismaService)
Mentionner la connexion à PostgreSQL via .env
*/
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connecté');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Prisma déconnecté');
  }
}
