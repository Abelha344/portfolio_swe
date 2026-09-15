"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { experienceSchema, type ExperienceInput } from "@/lib/validations";
import type { ActionResult } from "@/lib/actions/projects";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

export async function createExperience(
  input: ExperienceInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = experienceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;
    const experience = await prisma.experience.create({
      data: {
        company: data.company,
        role: data.role,
        location: data.location || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
        technologies: data.technologies,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/about");
    revalidatePath("/admin/dashboard");

    return { success: true, data: { id: experience.id } };
  } catch (error) {
    console.error("createExperience:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create experience",
    };
  }
}

export async function updateExperience(
  id: string,
  input: ExperienceInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = experienceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        company: data.company,
        role: data.role,
        location: data.location || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
        technologies: data.technologies,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/about");
    revalidatePath("/admin/dashboard");

    return { success: true, data: { id: experience.id } };
  } catch (error) {
    console.error("updateExperience:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update experience",
    };
  }
}

export async function deleteExperience(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/about");
    revalidatePath("/admin/dashboard");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("deleteExperience:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete experience",
    };
  }
}

export async function getExperiences() {
  return prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });
}
