import { faker, type Sex } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import { type Gender, PrismaClient, UserType } from '../generated/prisma/client';
import { SKILL_TO_CATEGORY, SKILLS_BY_CATEGORY } from '../lib/constants/skills';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const prisma = new PrismaClient({ adapter });

const ALL_SKILLS = Object.values(SKILLS_BY_CATEGORY).flat();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.log('Seeding is not allowed in production environment');
    process.exit(1);
  }

  console.log('Clearing database... 🧹');

  await prisma.user.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.location.deleteMany();
  await prisma.occupation.deleteMany();

  console.log('Seeding users... 🌱');

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

    const randomSkills = faker.helpers.arrayElements(ALL_SKILLS, faker.number.int({ min: 1, max: 5 }));

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
            onboardingCompleted: true,
            location: {
              connectOrCreate: {
                where: {
                  city_country: { city: city, country: country }
                },
                create: { city, country }
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
              connectOrCreate: randomSkills.map((name) => ({
                where: { name },
                create: { name, category: SKILL_TO_CATEGORY[name] }
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
