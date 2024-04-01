import { PrismaClient, UserType, Gender } from '@prisma/client';
import { faker, Sex } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Seeding is only allowed in development environment');
  }

  console.log('Start seeding 🌱');

  const promises = Array.from({ length: 100 }, async () => {
    const gender = faker.person.sex();
    const firstName = faker.person.firstName(gender as Sex);
    const lastName = faker.person.lastName(gender as Sex);
    const name = faker.person.fullName({ firstName, lastName });
    const email = faker.internet.email({ firstName, lastName });

    const city = faker.location.city();
    const country = faker.location.country();

    const role = faker.person.jobTitle();
    const yearsOfExperience = faker.number.int({ min: 1, max: 30 });
    const company = faker.company.name();

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
              connectOrCreate: {
                where: {
                  city_country: { city, country }
                },
                create: {
                  city,
                  country
                }
              }
            },
            occupation: {
              connectOrCreate: {
                where: {
                  role_company_yearsOfExperience: { role, company, yearsOfExperience }
                },
                create: { role: role, yearsOfExperience: yearsOfExperience, company: company }
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
