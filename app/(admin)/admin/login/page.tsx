import { Suspense } from "react";
import AdminLoginPage from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <AdminLoginPage />
    </Suspense>
  );
}
