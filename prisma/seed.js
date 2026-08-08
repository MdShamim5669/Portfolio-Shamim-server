import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // Read cv_data.json
  const possiblePaths = [
    path.join(__dirname, '../../client/Docs/cv_data.json'),
    path.join(__dirname, '../../Docs/cv_data.json'),
    path.join(__dirname, '../src/Docs_/cv_data.json'),
    path.join(__dirname, './cv_data.json'),
  ];

  let cvDataPath = possiblePaths.find((p) => fs.existsSync(p));
  if (!cvDataPath) {
    console.error('❌ cv_data.json not found in candidate paths:', possiblePaths);
    process.exit(1);
  }

  const cvData = JSON.parse(fs.readFileSync(cvDataPath, 'utf8'));

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || cvData.profile.email;
  const adminRawPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePassword123!';
  const hashedPassword = await bcrypt.hash(adminRawPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword, role: 'ADMIN' },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin User Seeded: ${adminUser.email}`);

  // 2. Seed Profile
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      fullName: cvData.profile.fullName,
      title: cvData.profile.title,
      bio: cvData.profile.summary,
      email: cvData.profile.email,
      phone: cvData.profile.phone,
      location: cvData.profile.location,
      cgpa: cvData.profile.cgpa,
      university: cvData.profile.university,
      degree: cvData.profile.degree,
      githubUrl: cvData.profile.githubUrl,
      linkedinUrl: cvData.profile.linkedinUrl,
      resumeUrl: '/CV_Shamim.pdf',
    },
  });
  console.log('✅ Profile Info Seeded');

  // 3. Seed Skills
  await prisma.skill.deleteMany();
  for (let i = 0; i < cvData.skills.length; i++) {
    const s = cvData.skills[i];
    await prisma.skill.create({
      data: {
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
        iconName: s.iconName,
        order: i + 1,
      },
    });
  }
  console.log(`✅ ${cvData.skills.length} Skills Seeded`);

  // 4. Seed Projects
  await prisma.project.deleteMany();
  for (let i = 0; i < cvData.projects.length; i++) {
    const p = cvData.projects[i];
    await prisma.project.create({
      data: {
        title: p.title,
        tagline: p.tagline,
        description: p.description,
        techStack: p.techStack,
        liveDemoUrl: p.liveDemoUrl,
        clientGithubUrl: p.clientGithubUrl,
        serverGithubUrl: p.serverGithubUrl,
        isFeatured: p.isFeatured || true,
        order: i + 1,
      },
    });
  }
  console.log(`✅ ${cvData.projects.length} Projects Seeded`);

  // 5. Seed Thesis
  await prisma.thesis.deleteMany();
  await prisma.thesis.create({
    data: {
      title: cvData.thesis.title,
      summary: cvData.thesis.summary,
      accuracy: cvData.thesis.accuracy,
      modelName: cvData.thesis.modelName,
      datasetSize: cvData.thesis.datasetSize,
      techStack: cvData.thesis.techStack,
      githubUrl: cvData.thesis.githubUrl,
      highlights: [
        'Designed a machine learning pipeline using SMOTE feature engineering.',
        'Achieved 84.4% accuracy with an optimized Random Forest classifier on 317 survey responses.',
      ],
    },
  });
  console.log('✅ Research Thesis Seeded');

  // 6. Seed Experience
  await prisma.experience.deleteMany();
  for (let i = 0; i < cvData.experience.length; i++) {
    const e = cvData.experience[i];
    await prisma.experience.create({
      data: {
        role: e.role,
        company: e.company,
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description,
        highlights: e.highlights,
        order: i + 1,
      },
    });
  }
  console.log(`✅ ${cvData.experience.length} Experience Entries Seeded`);

  // 7. Seed Courses
  await prisma.course.deleteMany();
  for (let i = 0; i < cvData.courses.length; i++) {
    const c = cvData.courses[i];
    await prisma.course.create({
      data: {
        title: c.title,
        subtitle: c.subtitle,
        platform: c.platform,
        creatorRole: c.creatorRole,
        courseUrl: c.courseUrl,
        order: i + 1,
      },
    });
  }
  console.log(`✅ ${cvData.courses.length} Udemy Courses Seeded`);

  console.log('🎉 Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
