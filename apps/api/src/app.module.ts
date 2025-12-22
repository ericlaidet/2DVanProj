import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AppController } from './app.controller';
import { join } from 'path';
import { HealthModule } from './health/health.module';
import { AppLoggerModule } from './logger.module'; // ✅ import du logger
import { AIModule } from './ai/ai.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../..', '.env'), // ✅ va chercher le .env racine
    }),
    AuthModule,
    UsersModule, // ✅ AJOUT - Module Users
    PlansModule,
    HealthModule, // ✅ nouveau module de monitoring
    AppLoggerModule,
    AIModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
