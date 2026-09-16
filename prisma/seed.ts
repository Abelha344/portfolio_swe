import { PrismaClient, SkillCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "abelhailu0427@gmail.com")
    .toLowerCase()
    .trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is required. Set it in .env locally or in Vercel Environment Variables."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Keep a single admin account matching the configured email
  await prisma.adminUser.deleteMany({
    where: { NOT: { email } },
  });

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  await prisma.about.deleteMany();
  await prisma.about.create({
    data: {
      headline: "Full-Stack Developer building resilient products",
      bio: "I specialize in Next.js, React, Express, Nest.js, Django, FastAPI, PostgreSQL, MySQL, and MongoDB. I design end-to-end systems — from polished interfaces to production APIs and ERP workflows.",
      resumeUrl: "https://example.com/resume.pdf",
      avatarUrl: "/images/profile.jpg",
      linkedinUrl: "https://github.com/Abelha344",
      githubUrl: "https://github.com/Abelha344",
      email: "abelhailu0427@gmail.com",
      location: "Remote",
      availability: "Open to full-time & contract roles",
    },
  });

  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      { name: "Next.js", category: SkillCategory.FRONTEND, proficiency: 92, yearsOfExp: 4, iconName: "nextjs" },
      { name: "React", category: SkillCategory.FRONTEND, proficiency: 95, yearsOfExp: 5, iconName: "react" },
      { name: "TypeScript", category: SkillCategory.FRONTEND, proficiency: 90, yearsOfExp: 4, iconName: "typescript" },
      { name: "Express", category: SkillCategory.BACKEND, proficiency: 88, yearsOfExp: 5, iconName: "express" },
      { name: "Nest.js", category: SkillCategory.BACKEND, proficiency: 85, yearsOfExp: 3, iconName: "nestjs" },
      { name: "Django", category: SkillCategory.BACKEND, proficiency: 80, yearsOfExp: 3, iconName: "django" },
      { name: "FastAPI", category: SkillCategory.BACKEND, proficiency: 82, yearsOfExp: 2.5, iconName: "fastapi" },
      { name: "PostgreSQL", category: SkillCategory.DATABASE, proficiency: 90, yearsOfExp: 5, iconName: "postgres" },
      { name: "MySQL", category: SkillCategory.DATABASE, proficiency: 84, yearsOfExp: 4, iconName: "mysql" },
      { name: "MongoDB", category: SkillCategory.DATABASE, proficiency: 78, yearsOfExp: 3, iconName: "mongodb" },
      { name: "Docker", category: SkillCategory.DEVOPS, proficiency: 80, yearsOfExp: 3, iconName: "docker" },
      { name: "CI/CD", category: SkillCategory.DEVOPS, proficiency: 75, yearsOfExp: 3, iconName: "cicd" },
    ],
  });

  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        company: "Enterprise Systems Co.",
        role: "Full-Stack / ERP Engineer",
        location: "Remote",
        startDate: new Date("2022-03-01"),
        endDate: null,
        description:
          "Led full-stack delivery for ERP modules spanning inventory, finance, and workflow automation. Built Nest.js APIs, Next.js admin portals, and PostgreSQL schemas with audit trails and role-based access.",
        technologies: ["Next.js", "Nest.js", "PostgreSQL", "Prisma", "Docker"],
      },
      {
        company: "Product Studio",
        role: "Software Engineer",
        location: "Hybrid",
        startDate: new Date("2019-06-01"),
        endDate: new Date("2022-02-28"),
        description:
          "Shipped customer-facing React apps and Express/FastAPI services. Improved API latency and introduced CI pipelines for multi-environment deployments.",
        technologies: ["React", "Express", "FastAPI", "MySQL", "MongoDB"],
      },
    ],
  });

  await prisma.project.deleteMany();
  await prisma.project.create({
    data: {
      title: "ERP Inventory Platform",
      slug: "erp-inventory-platform",
      summary:
        "Multi-tenant inventory and procurement system with real-time stock visibility and approval workflows.",
      description: `## Overview
A production ERP module for warehouses and purchasing teams.

## Highlights
- Role-based dashboards
- Optimistic concurrency for stock mutations
- Audit logs for compliance`,
      featuredImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
      repoUrl: "https://github.com/example/erp-inventory",
      liveUrl: "https://example.com/erp",
      techStack: ["Next.js", "Nest.js", "PostgreSQL", "Prisma", "Redis"],
      priority: 100,
      isPublished: true,
      backendArchitecture: {
        overview: "Layered Nest.js domain services behind a Next.js BFF.",
        layers: [
          {
            name: "API Gateway / BFF",
            description: "Next.js server actions and route handlers for auth-aware aggregation.",
            tech: ["Next.js", "Auth.js"],
          },
          {
            name: "Domain Services",
            description: "Inventory, purchasing, and workflow modules with transactional boundaries.",
            tech: ["Nest.js", "Prisma"],
          },
          {
            name: "Data",
            description: "PostgreSQL with row-level tenancy and Redis cache for hot reads.",
            tech: ["PostgreSQL", "Redis"],
          },
        ],
        dataFlow: "UI → Server Actions → Nest services → Prisma → PostgreSQL; events fan out via Redis.",
        infrastructure: "Docker Compose locally; cloud Postgres + managed Redis in production.",
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "API Analytics Console",
      slug: "api-analytics-console",
      summary: "Observability dashboard for FastAPI services with latency and error budget tracking.",
      description: `## Overview
Operations console for API SLOs and incident triage.`,
      featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      techStack: ["React", "FastAPI", "MongoDB", "Docker"],
      priority: 80,
      isPublished: true,
      backendArchitecture: {
        overview: "FastAPI ingestion pipeline with MongoDB time-series collections.",
        layers: [
          {
            name: "Ingestion",
            description: "Async workers consume request metrics batches.",
            tech: ["FastAPI", "Celery"],
          },
        ],
        dataFlow: "Services emit metrics → queue → aggregator → MongoDB → React charts.",
      },
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login email: ${email}`);
  console.log("Password: (from ADMIN_PASSWORD env)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
