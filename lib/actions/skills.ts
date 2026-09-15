"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { skillSchema, type SkillInput } from "@/lib/validations";
import type { ActionResult } from "@/lib/actions/projects";
import type { SkillCategory } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

export async function createSkill(input: SkillInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = skillSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const skill = await prisma.skill.create({
      data: {
        name: parsed.data.name,
        category: parsed.data.category,
        iconName: parsed.data.iconName || null,
        proficiency: parsed.data.proficiency,
        yearsOfExp: parsed.data.yearsOfExp,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    revalidatePath("/admin/dashboard");

    return { success: true, data: { id: skill.id } };
  } catch (error) {
    console.error("createSkill:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create skill",
    };
  }
}

export async function updateSkill(
  id: string,
  input: SkillInput
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = skillSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name: parsed.data.name,
        category: parsed.data.category,
        iconName: parsed.data.iconName || null,
        proficiency: parsed.data.proficiency,
        yearsOfExp: parsed.data.yearsOfExp,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    revalidatePath("/admin/dashboard");

    return { success: true, data: { id: skill.id } };
  } catch (error) {
    console.error("updateSkill:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update skill",
    };
  }
}

export async function deleteSkill(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/skills");
    revalidatePath("/admin/dashboard");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("deleteSkill:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete skill",
    };
  }
}

export async function getSkills(category?: SkillCategory) {
  return prisma.skill.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ category: "asc" }, { proficiency: "desc" }],
  });
}
