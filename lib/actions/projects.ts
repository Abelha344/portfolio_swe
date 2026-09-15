"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { Prisma } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

function emptyToNull(value?: string | null) {
  if (!value || value.trim() === "") return null;
  return value;
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createProject(
  input: ProjectInput
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireAdmin();
    const parsed = projectSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;
    const slug = data.slug && data.slug.length > 0 ? data.slug : slugify(data.title);

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "A project with this slug already exists" };
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        description: data.description,
        featuredImage: emptyToNull(data.featuredImage),
        repoUrl: emptyToNull(data.repoUrl),
        liveUrl: emptyToNull(data.liveUrl),
        techStack: data.techStack,
        priority: data.priority,
        isPublished: data.isPublished,
        backendArchitecture:
          (data.backendArchitecture as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");

    return { success: true, data: { id: project.id, slug: project.slug } };
  } catch (error) {
    console.error("createProject:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

export async function updateProject(
  id: string,
  input: ProjectInput
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireAdmin();
    const parsed = projectSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;
    const slug = data.slug && data.slug.length > 0 ? data.slug : slugify(data.title);

    const conflict = await prisma.project.findFirst({
      where: { slug, NOT: { id } },
    });
    if (conflict) {
      return { success: false, error: "A project with this slug already exists" };
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        description: data.description,
        featuredImage: emptyToNull(data.featuredImage),
        repoUrl: emptyToNull(data.repoUrl),
        liveUrl: emptyToNull(data.liveUrl),
        techStack: data.techStack,
        priority: data.priority,
        isPublished: data.isPublished,
        backendArchitecture:
          (data.backendArchitecture as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");

    return { success: true, data: { id: project.id, slug: project.slug } };
  } catch (error) {
    console.error("updateProject:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

export async function deleteProject(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const project = await prisma.project.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");

    return { success: true, data: { id: project.id } };
  } catch (error) {
    console.error("deleteProject:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

export async function toggleProjectPublished(
  id: string
): Promise<ActionResult<{ id: string; isPublished: boolean }>> {
  try {
    await requireAdmin();
    const current = await prisma.project.findUnique({ where: { id } });
    if (!current) {
      return { success: false, error: "Project not found" };
    }

    const project = await prisma.project.update({
      where: { id },
      data: { isPublished: !current.isPublished },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: { id: project.id, isPublished: project.isPublished },
    };
  } catch (error) {
    console.error("toggleProjectPublished:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle publish",
    };
  }
}

export async function reorderProjects(
  orderedIds: string[]
): Promise<ActionResult<{ count: number }>> {
  try {
    await requireAdmin();

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: { priority: orderedIds.length - index },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");

    return { success: true, data: { count: orderedIds.length } };
  } catch (error) {
    console.error("reorderProjects:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder projects",
    };
  }
}

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, isPublished: true },
  });
}

export async function getAllProjects() {
  await requireAdmin();
  return prisma.project.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
}
