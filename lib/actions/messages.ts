"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  aboutSchema,
  messageSchema,
  type AboutInput,
  type MessageInput,
} from "@/lib/validations";
import type { ActionResult } from "@/lib/actions/projects";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}

export async function upsertAbout(input: AboutInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = aboutSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const existing = await prisma.about.findFirst();
    const data = {
      bio: parsed.data.bio,
      headline: parsed.data.headline || null,
      resumeUrl: parsed.data.resumeUrl || null,
      avatarUrl: parsed.data.avatarUrl || null,
      location: parsed.data.location || null,
      availability: parsed.data.availability || null,
    };

    const about = existing
      ? await prisma.about.update({ where: { id: existing.id }, data })
      : await prisma.about.create({ data });

    revalidatePath("/");
    revalidatePath("/admin/about");

    return { success: true, data: { id: about.id } };
  } catch (error) {
    console.error("upsertAbout:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save about",
    };
  }
}

export async function getAbout() {
  return prisma.about.findFirst();
}

export async function submitContactMessage(
  input: MessageInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = messageSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const message = await prisma.message.create({
      data: parsed.data,
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");

    return { success: true, data: { id: message.id } };
  } catch (error) {
    console.error("submitContactMessage:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
}

export async function getMessages() {
  await requireAdmin();
  return prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function markMessageRead(
  id: string,
  read = true
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    await prisma.message.update({ where: { id }, data: { read } });
    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("markMessageRead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update message",
    };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    await prisma.message.delete({ where: { id } });
    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("deleteMessage:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete message",
    };
  }
}

export async function getDashboardStats() {
  await requireAdmin();
  const [projects, published, skills, experiences, unreadMessages, messages] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { isPublished: true } }),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.message.count(),
    ]);

  return { projects, published, skills, experiences, unreadMessages, messages };
}
