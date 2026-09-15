"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
import type { Project } from "@prisma/client";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import {
  createProject,
  updateProject,
  deleteProject,
  toggleProjectPublished,
  reorderProjects,
} from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function splitCsv(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function ProjectForm({
  project,
  onDone,
}: {
  project?: Project;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      summary: project?.summary ?? "",
      description: project?.description ?? "",
      featuredImage: project?.featuredImage ?? "",
      repoUrl: project?.repoUrl ?? "",
      liveUrl: project?.liveUrl ?? "",
      techStack: project?.techStack ?? [],
      priority: project?.priority ?? 0,
      isPublished: project?.isPublished ?? false,
      backendArchitecture: (project?.backendArchitecture as ProjectInput["backendArchitecture"]) ?? {
        overview: "",
        layers: [],
        dataFlow: "",
        infrastructure: "",
      },
    },
  });

  const [techInput, setTechInput] = useState((project?.techStack ?? []).join(", "));
  const [archOverview, setArchOverview] = useState(
    ((project?.backendArchitecture as { overview?: string } | null)?.overview) ?? ""
  );

  const onSubmit = (values: ProjectInput) => {
    setError(null);
    const payload: ProjectInput = {
      ...values,
      techStack: splitCsv(techInput),
      backendArchitecture: archOverview
        ? {
            overview: archOverview,
            layers: values.backendArchitecture?.layers ?? [],
            dataFlow: values.backendArchitecture?.dataFlow,
            infrastructure: values.backendArchitecture?.infrastructure,
          }
        : null,
    };

    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, payload)
        : await createProject(payload);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onDone();
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input {...form.register("title")} />
        </div>
        <div className="space-y-2">
          <Label>Slug (optional)</Label>
          <Input {...form.register("slug")} placeholder="auto-from-title" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Summary</Label>
        <Textarea rows={2} {...form.register("summary")} />
      </div>
      <div className="space-y-2">
        <Label>Description (Markdown)</Label>
        <Textarea rows={6} {...form.register("description")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Featured image URL</Label>
          <Input {...form.register("featuredImage")} />
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Input type="number" {...form.register("priority", { valueAsNumber: true })} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Live URL</Label>
          <Input {...form.register("liveUrl")} />
        </div>
        <div className="space-y-2">
          <Label>Repo URL</Label>
          <Input {...form.register("repoUrl")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Tech stack (comma-separated)</Label>
        <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Architecture overview</Label>
        <Textarea rows={3} value={archOverview} onChange={(e) => setArchOverview(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...form.register("isPublished")} className="size-4 rounded border-border" />
        Published
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {project ? "Save changes" : "Create project"}
      </Button>
    </form>
  );
}

export function ProjectsAdmin({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [pending, startTransition] = useTransition();
  const [projects, setProjects] = useState(initialProjects);

  const refresh = () => {
    router.refresh();
    setOpen(false);
    setEditing(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...projects];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next);
    startTransition(async () => {
      await reorderProjects(next.map((p) => p.id));
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Create, edit, publish, and reorder projects.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              <Plus className="size-4" />
              Add project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle>
            </DialogHeader>
            <ProjectForm
              key={editing?.id ?? "new"}
              project={editing ?? undefined}
              onDone={refresh}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Stack</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={pending || index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={pending || index === projects.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-xs text-muted-foreground">{project.slug}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={project.isPublished ? "success" : "muted"}>
                    {project.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex max-w-[220px] flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        startTransition(async () => {
                          await toggleProjectPublished(project.id);
                          router.refresh();
                        })
                      }
                    >
                      {project.isPublished ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(project);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        startTransition(async () => {
                          if (!confirm("Delete this project?")) return;
                          await deleteProject(project.id);
                          router.refresh();
                        })
                      }
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {projects.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No projects yet. Create your first one.</p>
        ) : null}
      </div>
    </div>
  );
}
