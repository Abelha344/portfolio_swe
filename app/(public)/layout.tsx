import { PublicNavbar } from "@/components/public/PublicNavbar";
import { getAbout } from "@/lib/actions/messages";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let about = null;
  try {
    about = await getAbout();
  } catch {
    about = null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar resumeUrl={about?.resumeUrl} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Abel Hailu. All systems engineered with precision.</p>
          <nav className="flex flex-wrap items-center gap-6">
            <a href="/#projects" className="transition-colors hover:text-foreground">
              Projects
            </a>
            <a href="/#contact" className="transition-colors hover:text-foreground">
              Contact
            </a>
            <a href="/admin/login" className="transition-colors hover:text-foreground">
              Admin
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
