"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { Skill } from "@prisma/client";
import { skillSchema, type SkillInput } from "@/lib/validations";
import { createSkill, updateSkill, deleteSkill } from "@/lib/actions/skills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function SkillForm({ skill, onDone }: { skill?: Skill; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "FRONTEND",
      iconName: skill?.iconName ?? "",
      proficiency: skill?.proficiency ?? 70,
      yearsOfExp: skill?.yearsOfExp ?? 1,
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        setError(null);
        startTransition(async () => {
          const result = skill
            ? await updateSkill(skill.id, values)
            : await createSkill(values);
          if (!result.success) {
            setError(result.error);
            return;
          }
          onDone();
        });
      })}
    >
      <div className="space-y-2">
        <Label>Name</Label>
        <Input {...form.register("name")} />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <select
          className="flex h-10 w-full rounded-md border border-border bg-background/50 px-3 text-sm"
          {...form.register("category")}
        >
          <option value="FRONTEND">Frontend</option>
          <option value="BACKEND">Backend</option>
          <option value="DATABASE">Database</option>
          <option value="DEVOPS">DevOps</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Proficiency (0-100)</Label>
          <Input type="number" {...form.register("proficiency", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Years of experience</Label>
          <Input
            type="number"
            step="0.5"
            {...form.register("yearsOfExp", { valueAsNumber: true })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Icon name (optional)</Label>
        <Input {...form.register("iconName")} placeholder="e.g. react" />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {skill ? "Save" : "Create"}
      </Button>
    </form>
  );
}

export function SkillsAdmin({ initialSkills }: { initialSkills: Skill[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground">Manage categorized tech stack entries.</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Add skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit skill" : "New skill"}</DialogTitle>
            </DialogHeader>
            <SkillForm
              key={editing?.id ?? "new"}
              skill={editing ?? undefined}
              onDone={() => {
                setOpen(false);
                setEditing(null);
                router.refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden sm:table-cell">Proficiency</TableHead>
              <TableHead className="hidden md:table-cell">Years</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialSkills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>
                  <Badge variant="muted">{skill.category}</Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{skill.proficiency}%</TableCell>
                <TableCell className="hidden md:table-cell">{skill.yearsOfExp}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(skill);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          if (!confirm("Delete this skill?")) return;
                          await deleteSkill(skill.id);
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
        {initialSkills.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No skills yet.</p>
        ) : null}
      </div>
    </div>
  );
}
