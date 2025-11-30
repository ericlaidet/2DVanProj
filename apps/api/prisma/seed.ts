import { PrismaClient, SubscriptionType, VanType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Démarrage du seed...');

  // --- Création des vans de base ---
  const vansData = [
    { vanType: VanType.VOLKSWAGEN_ID_BUZZ, displayName: 'Volkswagen ID. Buzz', category: 'Compact', length: 4712, width: 1985 },
    { vanType: VanType.RENAULT_KANGOO_EXPRESS, displayName: 'Renault Kangoo Express', category: 'Compact', length: 4486, width: 1860 },
    { vanType: VanType.FIAT_DOBLO, displayName: 'Fiat Doblo', category: 'Compact', length: 4400, width: 1832 },
    { vanType: VanType.MERCEDES_VITO, displayName: 'Mercedes Vito', category: 'Moyen', length: 5143, width: 1928 },
    { vanType: VanType.FORD_TRANSIT_CUSTOM_L1, displayName: 'Ford Transit Custom L1', category: 'Moyen', length: 4972, width: 1986 },
    { vanType: VanType.RENAULT_MASTER_L2H2, displayName: 'Renault Master L2H2', category: 'Grand', length: 5548, width: 2070 },
    { vanType: VanType.CITROEN_JUMPER_L2H2, displayName: 'Citroën Jumper L2H2', category: 'Grand', length: 5413, width: 2050 },
    { vanType: VanType.MERCEDES_SPRINTER_L3H2, displayName: 'Mercedes Sprinter L3H2', category: 'XL', length: 5932, width: 2020 },
    { vanType: VanType.FIAT_DUCATO_L3H2, displayName: 'Fiat Ducato L3H2', category: 'XL', length: 5998, width: 2050 },
    { vanType: VanType.IVECO_DAILY_35S14_L2H2, displayName: 'Iveco Daily 35S14 L2H2', category: 'Grand', length: 5520, width: 2010 },
    { vanType: VanType.MAN_TGE_L3H2, displayName: 'MAN TGE L3H2', category: 'XL', length: 5986, width: 2040 },
    { vanType: VanType.MERCEDES_SPRINTER_L4H2, displayName: 'Mercedes Sprinter L4H2', category: 'XXL', length: 7367, width: 2020 },
    { vanType: VanType.VOLKSWAGEN_CRAFTER_L4H2, displayName: 'Volkswagen Crafter L4H2', category: 'XXL', length: 7391, width: 2040 },
    { vanType: VanType.MERCEDES_SPRINTER_L5H2, displayName: 'Mercedes Sprinter L5H2', category: 'XXXL', length: 7867, width: 2020 },
    { vanType: VanType.VOLKSWAGEN_CRAFTER_L5H2, displayName: 'Volkswagen Crafter L5H2', category: 'XXXL', length: 7890, width: 2040 },
    { vanType: VanType.RENAULT_MASTER_L3H2, displayName: 'Renault Master L3H2', category: 'XL', length: 6198, width: 2070 },
    { vanType: VanType.CITROEN_JUMPER_L3H2, displayName: 'Citroën Jumper L3H2', category: 'XL', length: 5998, width: 2050 },
    { vanType: VanType.MAN_TGE_L4H2, displayName: 'MAN TGE L4H2', category: 'XXL', length: 7391, width: 2040 },
    { vanType: VanType.IVECO_DAILY_35S14_L3H2, displayName: 'Iveco Daily 35S14 L3H2', category: 'XL', length: 6190, width: 2010 },
    { vanType: VanType.MERCEDES_SPRINTER_L3H2_MINI_BUS, displayName: 'Mercedes Sprinter L3H2 Mini Bus', category: 'Bus', length: 5932, width: 2020 },
    { vanType: VanType.VOLKSWAGEN_CRAFTER_L3H2_MINI_BUS, displayName: 'Volkswagen Crafter L3H2 Mini Bus', category: 'Bus', length: 5986, width: 2040 },
  ];

  for (const van of vansData) {
    await prisma.van.upsert({
      where: { vanType: van.vanType },
      update: {},
      create: van,
    });
  }

  console.log(`🚐 ${vansData.length} modèles de vans insérés ou mis à jour.`);

  // --- Création d’un utilisateur admin ---
  const hashedPassword = await bcrypt.hash('admin1234', 10);

  await prisma.user.upsert({
    where: { email: 'admin@vanplanner.dev' },
    update: {},
    create: {
      email: 'admin@vanplanner.dev',
      password: hashedPassword,
      name: 'Admin',
      subscription: SubscriptionType.PRO3,
    },
  });

  console.log('👤 Utilisateur admin créé : admin@vanplanner.dev / admin1234');

  console.log('✅ Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
