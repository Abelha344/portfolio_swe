"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function messageFromAuthError(code: string | null) {
  if (!code) return null;
  if (code === "Configuration") {
    return "Server auth is misconfigured. Set AUTH_SECRET in Vercel and redeploy.";
  }
  if (code === "CredentialsSignin") {
    return "Invalid email or password";
  }
  return "Sign-in failed. Try again.";
}

export default function AdminLoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const [error, setError] = useState<string | null>(
    messageFromAuthError(searchParams.get("error"))
  );
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lock className="size-5 text-primary" />
            Admin Login
          </CardTitle>
          <CardDescription>Sign in to manage portfolio content.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={(formData) => {
              setError(null);
              startTransition(async () => {
                const result = await loginAction(formData);
                if (result && !result.success) {
                  setError(result.error);
                }
              });
            }}
            className="space-y-4"
          >
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                defaultValue="abelhailu0427@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
