import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth().catch(() => null);

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {session?.user ? <AdminSidebar email={session.user.email} /> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
