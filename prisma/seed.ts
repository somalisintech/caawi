import { PrismaClient, UserType, Gender } from '@prisma/client';
import { faker, Sex } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Seeding is only allowed in development environment');
  }

  console.log('Clearing database... 🧹');

  await prisma.user.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.location.deleteMany();
  await prisma.occupation.deleteMany();

  console.log('Start seeding 🌱');

  const skills = ['JavaScript', 'React', 'Node.js']; // Add more skills as needed
  const userSkills = await Promise.all(
    skills.map(async (skill) => {
      return prisma.skill.upsert({
        where: { name: skill },
        update: {},
        create: { name: skill }
      });
    })
  );

  const promises = Array.from({ length: 100 }, async () => {
    const gender = faker.person.sex();
    const firstName = faker.person.firstName(gender as Sex);
    const lastName = faker.person.lastName(gender as Sex);
    const email = faker.internet.email({ firstName, lastName });

    const city = faker.location.city();
    const country = faker.location.country();

    const role = faker.person.jobTitle();
    const yearsOfExperience = faker.number.int({ min: 1, max: 30 });
    const company = faker.company.name();

    return prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        image: faker.image.avatar(),
        profile: {
          create: {
            userType: faker.helpers.enumValue(UserType),
            bio: faker.person.bio(),
            gender: gender.toUpperCase() as Gender,
            yearsOfExperience,
            location: {
              connectOrCreate: {
                where: {
                  city_country: { city: city, country: country }
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
                  role_company: { role: role, company: company }
                },
                create: { role: role, company: company }
              }
            },
            skills: {
              connectOrCreate: userSkills.map((skill) => ({
                where: { name: skill.name },
                create: { name: skill.name }
              }))
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
