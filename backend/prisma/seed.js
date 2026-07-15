const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clear existing data
  await prisma.tithe.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.service.deleteMany();
  await prisma.transferLog.deleteMany();
  await prisma.member.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: 'Admin'
    }
  });

  // 2. Create Members Hierarchy
  
  // Major General (Top Level)
  const majorGeneral = await prisma.member.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'Male',
      phoneNumber: '+2348000000001',
      position: 'Major General',
      isWorker: true,
      status: 'Active'
    }
  });

  // Pastor 1
  const pastor1 = await prisma.member.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      gender: 'Female',
      position: 'Pastor',
      isWorker: true,
      status: 'Active',
      parentId: majorGeneral.id
    }
  });

  // Pastor 2
  const pastor2 = await prisma.member.create({
    data: {
      firstName: 'David',
      lastName: 'Johnson',
      gender: 'Male',
      position: 'Pastor',
      isWorker: true,
      status: 'Active',
      parentId: majorGeneral.id
    }
  });

  // Coordinator under Pastor 1
  const coordinator1 = await prisma.member.create({
    data: {
      firstName: 'Michael',
      lastName: 'Brown',
      gender: 'Male',
      position: 'Coordinator',
      isWorker: true,
      status: 'Active',
      parentId: pastor1.id
    }
  });

  // Coordinator under Pastor 2
  const coordinator2 = await prisma.member.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Davis',
      gender: 'Female',
      position: 'Coordinator',
      isWorker: true,
      status: 'Active',
      parentId: pastor2.id
    }
  });

  // A few Souls (Regular Members)
  const soulsData = [
    { firstName: 'James', lastName: 'Wilson', parentId: coordinator1.id },
    { firstName: 'Mary', lastName: 'Taylor', parentId: coordinator1.id },
    { firstName: 'Robert', lastName: 'Anderson', parentId: coordinator2.id },
    { firstName: 'Linda', lastName: 'Thomas', parentId: coordinator2.id },
    { firstName: 'William', lastName: 'Jackson', parentId: pastor1.id }, // Direct to Pastor
  ];

  for (const soul of soulsData) {
    await prisma.member.create({
      data: {
        firstName: soul.firstName,
        lastName: soul.lastName,
        gender: 'Male',
        position: 'Soul',
        isWorker: false,
        status: 'Active',
        parentId: soul.parentId
      }
    });
  }

  // 3. Create a Service and Attendance (Mock Data)
  const service = await prisma.service.create({
    data: {
      name: 'Sunday Service',
      date: new Date()
    }
  });

  // Mark Major General present
  await prisma.attendance.create({
    data: {
      memberId: majorGeneral.id,
      serviceId: service.id,
      status: 'Present'
    }
  });

  // 4. Create some Tithes
  await prisma.tithe.create({
    data: {
      memberId: majorGeneral.id,
      amount: 50000,
      method: 'Cash',
      date: new Date()
    }
  });

  await prisma.tithe.create({
    data: {
      memberId: pastor1.id,
      amount: 20000,
      method: 'Transfer',
      date: new Date()
    }
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
