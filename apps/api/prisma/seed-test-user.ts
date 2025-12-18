// apps/api/prisma/seed-test-user.ts
// Script pour créer l'utilisateur de test en CI

import { PrismaClient, SubscriptionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedTestUser() {
  const testEmail = 'sonik.vigbea@gmail.com';
  const testPassword = 'Sonik123';
  const testName = 'Sonik';

  console.log('🌱 Seed: Creating test user...');

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (existingUser) {
      console.log('✅ Test user already exists:', {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: testName,
        password: hashedPassword,
        subscription: SubscriptionType.PRO1,
        settings: {
          currency: 'EUR',
          darkMode: false,
          language: 'fr',
        },
      },
    });

    console.log('✅ Test user created successfully:', {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting seed process...');
  await seedTestUser();
  console.log('✅ Seed process completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  