import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const projectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case")
    .or(z.literal(""))
    .optional(),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  featuredImage: z.string().url().or(z.literal("")).optional(),
  repoUrl: z.string().url().or(z.literal("")).optional(),
  liveUrl: z.string().url().or(z.literal("")).optional(),
  techStack: z.array(z.string().min(1)).min(1, "Add at least one technology"),
  priority: z.number().int().min(0),
  isPublished: z.boolean(),
  backendArchitecture: z
    .object({
      overview: z.string().optional(),
      layers: z
        .array(
          z.object({
            name: z.string(),
            description: z.string(),
            tech: z.array(z.string()).optional(),
          })
        )
        .optional(),
      dataFlow: z.string().optional(),
      infrastructure: z.string().optional(),
    })
    .nullable()
    .optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["FRONTEND", "BACKEND", "DATABASE", "DEVOPS"]),
  iconName: z.string().or(z.literal("")).optional(),
  proficiency: z.number().int().min(0).max(100),
  yearsOfExp: z.number().min(0).max(40),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().or(z.literal("")).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().or(z.literal("")).optional(),
  description: z.string().min(10, "Description is required"),
  technologies: z.array(z.string().min(1)),
});

export const aboutSchema = z.object({
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  headline: z.string().or(z.literal("")).optional(),
  resumeUrl: z.string().url().or(z.literal("")).optional(),
  avatarUrl: z.string().url().or(z.literal("")).optional(),
  location: z.string().or(z.literal("")).optional(),
  availability: z.string().or(z.literal("")).optional(),
});

export const messageSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject is required"),
  body: z.string().min(10, "Message must be at least 10 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type AboutInput = z.infer<typeof aboutSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
