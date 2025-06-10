import { PrismaClient, UserType, Gender, ResourceType } from '@prisma/client'; // Added ResourceType
import { faker, Sex } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.log('Seeding is not allowed in production environment');
    process.exit(1);
  }

  console.log('Clearing database... 🧹');

  // Clear Resource Hub tables first to avoid foreign key issues if users/profiles are deleted before resources
  await prisma.resource.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.resourceCategory.deleteMany();

  await prisma.user.deleteMany(); // This will also delete Profile due to cascading or relation settings
  await prisma.profile.deleteMany(); // May be redundant if User deletion cascades, but explicit is fine
  await prisma.location.deleteMany();
  await prisma.occupation.deleteMany();
  await prisma.skill.deleteMany(); // Added to clear skills for cleaner re-seeding if needed

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

  // --- BEGIN RESOURCE HUB SEEDING ---

  console.log('Seeding resource categories...');
  const categoriesData = [
    { name: 'Software Development', description: 'Resources for software engineers and developers.' },
    { name: 'Data Science & AI', description: 'Learn about data analysis, machine learning, and AI.' },
    { name: 'Career Development', description: 'Tips for resume building, interviews, and career growth.' },
    { name: 'UX/UI Design', description: 'Resources for designers.' },
    { name: 'Cybersecurity', description: 'Learn about protecting systems and data.' },
  ];
  const createdCategories = await Promise.all(
    categoriesData.map(async (cat) => {
      return prisma.resourceCategory.upsert({
        where: { name: cat.name },
        update: { description: cat.description },
        create: cat,
      });
    })
  );
  console.log('Resource categories seeded.');

  console.log('Seeding tags...');
  const tagsData = [
    { name: 'JavaScript' }, { name: 'React' }, { name: 'Python' }, { name: 'Node.js' },
    { name: 'Career Advice' }, { name: 'Portfolio' }, { name: 'BeginnerFriendly' },
    { name: 'Machine Learning' }, { name: 'Web Development' }, { name: 'Security Best Practices' }
  ];
  const createdTags = await Promise.all(
    tagsData.map(async (tag) => {
      return prisma.tag.upsert({
        where: { name: tag.name },
        update: {}, // No specific fields to update if it exists, just ensure it's there
        create: tag,
      });
    })
  );
  console.log('Tags seeded.');

  console.log('Seeding sample resources...');
  const resourcesData = [
    {
      title: 'Official React Documentation',
      url: 'https://react.dev/',
      description: 'The official documentation for React, a JavaScript library for building user interfaces.',
      resourceType: ResourceType.ARTICLE,
      categoryId: createdCategories.find(c => c.name === 'Software Development')?.id,
      tags: [createdTags.find(t => t.name === 'React')?.id, createdTags.find(t => t.name === 'JavaScript')?.id, createdTags.find(t => t.name === 'Web Development')?.id].filter(Boolean) as number[],
    },
    {
      title: 'Python for Data Science Handbook',
      url: 'https://jakevdp.github.io/PythonDataScienceHandbook/',
      description: 'A comprehensive online book on using Python for data science tasks.',
      resourceType: ResourceType.ARTICLE,
      categoryId: createdCategories.find(c => c.name === 'Data Science & AI')?.id,
      tags: [createdTags.find(t => t.name === 'Python')?.id, createdTags.find(t => t.name === 'Machine Learning')?.id, createdTags.find(t => t.name === 'BeginnerFriendly')?.id].filter(Boolean) as number[],
    },
    {
      title: 'Awesome Resume Templates by Resume.io',
      url: 'https://resume.io/resume-templates',
      description: 'A collection of professional resume templates.',
      resourceType: ResourceType.TOOL,
      categoryId: createdCategories.find(c => c.name === 'Career Development')?.id,
      tags: [createdTags.find(t => t.name === 'Career Advice')?.id, createdTags.find(t => t.name === 'Portfolio')?.id].filter(Boolean) as number[],
    },
    {
      title: 'CS50: Introduction to Computer Science',
      url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x',
      description: 'Harvard University_s introduction to the intellectual enterprises of computer science and the art of programming.',
      resourceType: ResourceType.COURSE,
      categoryId: createdCategories.find(c => c.name === 'Software Development')?.id,
      tags: [createdTags.find(t => t.name === 'BeginnerFriendly')?.id, createdTags.find(t => t.name === 'Web Development')?.id].filter(Boolean) as number[],
    }
  ];

  await Promise.all(
    resourcesData.map(async (res) => {
      if (!res.categoryId) {
        console.warn(`Skipping resource "${res.title}" due to missing category ID.`);
        return null;
      }
      // Ensure tags are valid numbers before attempting to connect
      const validTagIds = res.tags.filter(tagId => typeof tagId === 'number');

      return prisma.resource.create({
        data: {
          title: res.title,
          url: res.url,
          description: res.description,
          resourceType: res.resourceType, // Direct enum usage
          category: { connect: { id: res.categoryId } },
          tags: { connect: validTagIds.map(tagId => ({ id: tagId })) },
        },
      });
    })
  );
  console.log('Sample resources seeded.');

  // --- END RESOURCE HUB SEEDING ---

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
