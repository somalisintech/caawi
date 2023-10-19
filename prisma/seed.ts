import { $Enums, PrismaClient, UserType } from '@prisma/client';
import { faker, Sex } from '@faker-js/faker';
import Gender = $Enums.Gender;
const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Seeding is only allowed in development environment');
  }
  console.log('Clearing database 🗑️');

  await prisma.user.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.location.deleteMany();
  await prisma.occupation.deleteMany();
  await prisma.company.deleteMany();

  console.log('Start seeding 🌱');

  for (let i = 0; i < 100; i++) {
    const gender = faker.person.sex();
    const firstName = faker.person.firstName(gender as Sex);
    const lastName = faker.person.lastName(gender as Sex);
    const name = faker.person.fullName({ firstName, lastName });
    const email = faker.internet.email({
      firstName,
      lastName
    });

    await prisma.user.create({
      data: {
        name,
        firstName,
        lastName,
        email,
        image: faker.image.avatar(),
        profile: {
          create: {
            userType: faker.helpers.enumValue(UserType),
            bio: faker.person.bio(),
            gender: gender.toUpperCase() as Gender,
            location: {
              create: {
                city: faker.location.city(),
                country: faker.location.country()
              }
            },
            occupation: {
              create: {
                role: faker.person.jobTitle(),
                yearsOfExperience: faker.number.int({ min: 1, max: 30 }),
                company: {
                  create: {
                    name: faker.company.name()
                  }
                }
              }
            }
          }
        }
      }
    });
  }
  console.log('Seeding finished ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
