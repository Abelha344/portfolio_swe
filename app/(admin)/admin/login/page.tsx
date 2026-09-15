import { Suspense } from "react";
import AdminLoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
