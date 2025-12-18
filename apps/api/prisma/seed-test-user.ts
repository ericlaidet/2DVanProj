// apps/api/prisma/seed-test-user.ts
// Script pour créer l'utilisateur de test en CI

import { PrismaClient, SubscriptionType, VanType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedTestUser() {
  const testEmail = 'sonik.vigbea@gmail.com';
  const testPassword = 'Sonik123';
  const testName = 'Sonik';

  console.log('🌱 Seed: Starting seed process...');

  // --- 1. Seed Vans (CRITICAL for Plan creation) ---
  const vansData = [
    { vanType: VanType.VOLKSWAGEN_ID_BUZZ, displayName: 'Volkswagen ID. Buzz', category: 'Compact', length: 4712, width: 1985, height: 1800 },
    { vanType: VanType.RENAULT_KANGOO_EXPRESS, displayName: 'Renault Kangoo Express', category: 'Compact', length: 4486, width: 1860, height: 1800 },
    { vanType: VanType.FIAT_DOBLO, displayName: 'Fiat Doblo', category: 'Compact', length: 4400, width: 1832, height: 1780 },
    { vanType: VanType.MERCEDES_VITO, displayName: 'Mercedes Vito', category: 'Moyen', length: 5143, width: 1928, height: 1900 },
    { vanType: VanType.FORD_TRANSIT_CUSTOM_L1, displayName: 'Ford Transit Custom L1', category: 'Moyen', length: 4972, width: 1986, height: 1920 },
    { vanType: VanType.RENAULT_MASTER_L2H2, displayName: 'Renault Master L2H2', category: 'Grand', length: 5548, width: 2070, height: 2240 },
    { vanType: VanType.CITROEN_JUMPER_L2H2, displayName: 'Citroën Jumper L2H2', category: 'Grand', length: 5413, width: 2050, height: 2272 },
    { vanType: VanType.MERCEDES_SPRINTER_L3H2, displayName: 'Mercedes Sprinter L3H2', category: 'XL', length: 5932, width: 2020, height: 2300 },
    { vanType: VanType.FIAT_DUCATO_L3H2, displayName: 'Fiat Ducato L3H2', category: 'XL', length: 5998, width: 2050, height: 2272 },
    { vanType: VanType.IVECO_DAILY_35S14_L2H2, displayName: 'Iveco Daily 35S14 L2H2', category: 'Grand', length: 5520, width: 2010, height: 2250 },
    { vanType: VanType.MAN_TGE_L3H2, displayName: 'MAN TGE L3H2', category: 'XL', length: 5986, width: 2040, height: 2300 },
    { vanType: VanType.MERCEDES_SPRINTER_L4H2, displayName: 'Mercedes Sprinter L4H2', category: 'XXL', length: 7367, width: 2020, height: 2300 },
    { vanType: VanType.VOLKSWAGEN_CRAFTER_L4H2, displayName: 'Volkswagen Crafter L4H2', category: 'XXL', length: 7391, width: 2040, height: 2300 },
    { vanType: VanType.MERCEDES_SPRINTER_L5H2, displayName: 'Mercedes Sprinter L5H2', category: 'XXXL', length: 7867, width: 2020, height: 2300 },
    { vanType: VanType.VOLKSWAGEN_CRAFTER_L5H2, displayName: 'Volkswagen Crafter L5H2', category: 'XXXL', length: 7890, width: 2040, height: 2300 },
    { vanType: VanType.RENAULT_MASTER_L3H2, displayName: 'Renault Master L3H2', category: 'XL', length: 6198, width: 2070, height: 2240 },
    { vanType: VanType.CITROEN_JUMPER_L3H2, displayName: 'Citroën Jumper L3H2', category: 'XL', length: 5998, width: 2050, height: 2272 },
    { vanType: VanType.MAN_TGE_L4H2, displayName: 'MAN TGE L4H2', category: 'XXL', length: 7391, width: 2040, height: 2300 },
    { vanType: VanType.IVECO_DAILY_35S14_L3H2, displayName: 'Iveco Daily 35S14 L3H2', category: 'XL', length: 6190, width: 2010, height: 2250 },
    { vanType: VanType.MERCEDES_SPRINTER_L3H2_MINI_BUS, displayName: 'Mercedes Sprinter L3H2 Mini Bus', category: 'Bus', length: 5932, width: 2020, height: 2300 },
    { vanType: VanType.VOLKSWAGEN_CRAFTER_L3H2_MINI_BUS, displayName: 'Volkswagen Crafter L3H2 Mini Bus', category: 'Bus', length: 5986, width: 2040, height: 2300 },
  ];

  for (const van of vansData) {
    await prisma.van.upsert({
      where: { vanType: van.vanType },
      update: {},
      create: van,
    });
  }
  console.log(`🚐 Seed: ${vansData.length} vans created.`);

  // --- 2. Create Test User ---
  console.log('👤 Seed: Creating test user...');

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
