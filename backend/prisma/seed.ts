import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if business already exists
  const existing = await prisma.business.findFirst();
  if (existing) {
    console.log('✅ Business already exists — skipping seed.');
    return;
  }

  // Create the one business record
  const business = await prisma.business.create({
    data: {
      name: 'Schedulix Demo Business',
      description: 'A full-service appointment booking business powered by Schedulix.',
      email: 'admin@schedulix.com',
      phone: '+1-555-000-0000',
      address: '123 Main Street, City, Country',
      timezone: 'UTC',
      slotIntervalMinutes: 15,
      bufferMinutes: 10,
      cancellationHours: 24,
      depositPercent: 20,
    },
  });

  console.log(`✅ Business created: ${business.name} (${business.id})`);
  console.log('🌱 Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });