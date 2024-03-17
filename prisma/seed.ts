import { $Enums, PrismaClient, UserType } from '@prisma/client';
import { faker, Sex } from '@faker-js/faker';
import Gender = $Enums.Gender;
const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Seeding is only allowed in development environment');
  }

  console.log('Start seeding 🌱');

  const promises = Array.from({ length: 100 }, () => {
    const gender = faker.person.sex();
    const firstName = faker.person.firstName(gender as Sex);
    const lastName = faker.person.lastName(gender as Sex);
    const name = faker.person.fullName({ firstName, lastName });
    const email = faker.internet.email({
      firstName,
      lastName
    });

    return prisma.user.create({
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
                company: faker.company.name()
              }
            }
          }
        }
      }
    });
  });

  await Promise.all(promises);

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
