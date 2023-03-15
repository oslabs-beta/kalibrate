const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

// create auth providers
const initializeDatabase = async () => {
  // verify if already exists
  const authProviders = await prisma.authProvider.findMany();

  // create if doesn't exist
  if (!authProviders.length) {
    await prisma.authProvider.create({
      data: {name: 'Kalibrate'},
    });

    console.log('auth provider record created');
  }
};

initializeDatabase();
