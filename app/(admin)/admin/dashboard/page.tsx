import Link from "next/link";
import { FolderKanban, Mail, Wrench, Eye } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Projects",
      value: stats.projects,
      hint: `${stats.published} published`,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      label: "Skills",
      value: stats.skills,
      hint: "Tech stack entries",
      icon: Wrench,
      href: "/admin/skills",
    },
    {
      label: "Messages",
      value: stats.messages,
      hint: `${stats.unreadMessages} unread`,
      icon: Mail,
      href: "/admin/messages",
    },
    {
      label: "Experience",
      value: stats.experiences,
      hint: "Timeline entries",
      icon: Eye,
      href: "/admin/about",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of portfolio content and inbox activity.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects">Manage projects</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <Card className="transition-colors hover:border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <Icon className="size-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{card.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
