"use server";

import { AuthError } from "next-auth";
import { redirect, unstable_rethrow } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid email or password" };
  }

  const callbackUrl = String(formData.get("callbackUrl") || "/admin/dashboard");
  const redirectTo = callbackUrl.startsWith("/admin")
    ? callbackUrl
    : "/admin/dashboard";

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase().trim(),
      password: parsed.data.password,
      redirectTo,
    });
  } catch (error) {
    unstable_rethrow(error);

    if (error instanceof AuthError) {
      const type = String(error.type);
      if (type === "Configuration") {
        return {
          success: false as const,
          error:
            "Server auth is misconfigured. Set AUTH_SECRET in Vercel and redeploy.",
        };
      }
      return { success: false as const, error: "Invalid email or password" };
    }

    throw error;
  }

  redirect(redirectTo);
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
