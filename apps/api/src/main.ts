import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Logger } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // ⚡ à créer

import { json, urlencoded } from 'express';

async function bootstrap() {
  // ✅ Charger les variables d'environnement depuis apps/api/.env
  dotenv.config({ path: 'apps/api/.env' });

  // ✅ Création de l'application avec logger intégré
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  // ✅ Augmenter la limite de taille du payload pour les captures d'écran
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // ==============================
  // 🛡️ Sécurité de base
  // ==============================
  app.use(helmet());

  // ✅ Limiteur de requêtes (anti-abus / DDoS)
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // max 200 requêtes / IP / 15 min
      message: 'Trop de requêtes, réessayez plus tard.',
    }),
  );

  // ==============================
  // ✅ Validation globale
  // ==============================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ==============================
  // ⚠️ Gestion globale des erreurs
  // ==============================
  app.useGlobalFilters(new AllExceptionsFilter());

  // ==============================
  // 🌐 Configuration CORS dynamique
  // ==============================
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    process.env.FRONTEND_URL ||
    'http://localhost:5173'
  )
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 [CORS] Requête refusée : ${origin}`);
        callback(new Error('Non autorisé par la politique CORS'));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ==============================
  // 🚀 Démarrage du serveur
  // ==============================
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('==============================================');
  console.log(`✅ API NestJS démarrée`);
  console.log(`📡 Port: ${port}`);
  console.log(`🌍 Origines autorisées (CORS):`);
  allowedOrigins.forEach((o) => console.log(`   - ${o}`));
  console.log(`🚀 URL du serveur: ${await app.getUrl()}`);
  console.log('==============================================');
}

bootstrap();
