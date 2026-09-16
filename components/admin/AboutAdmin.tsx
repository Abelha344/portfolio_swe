"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { About, Experience } from "@prisma/client";
import {
  aboutSchema,
  experienceSchema,
  type AboutInput,
  type ExperienceInput,
} from "@/lib/validations";
import { upsertAbout } from "@/lib/actions/messages";
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/actions/experience";
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

function toDateInput(value?: Date | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function ExperienceForm({
  experience,
  onDone,
}: {
  experience?: Experience;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [techInput, setTechInput] = useState((experience?.technologies ?? []).join(", "));
  const form = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: experience?.company ?? "",
      role: experience?.role ?? "",
      location: experience?.location ?? "",
      startDate: toDateInput(experience?.startDate),
      endDate: toDateInput(experience?.endDate),
      description: experience?.description ?? "",
      technologies: experience?.technologies ?? [],
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        setError(null);
        const payload = {
          ...values,
          technologies: techInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        };
        startTransition(async () => {
          const result = experience
            ? await updateExperience(experience.id, payload)
            : await createExperience(payload);
          if (!result.success) {
            setError(result.error);
            return;
          }
          onDone();
        });
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Company</Label>
          <Input {...form.register("company")} />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input {...form.register("role")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input {...form.register("location")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Start date</Label>
          <Input type="date" {...form.register("startDate")} />
        </div>
        <div className="space-y-2">
          <Label>End date</Label>
          <Input type="date" {...form.register("endDate")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea rows={4} {...form.register("description")} />
      </div>
      <div className="space-y-2">
        <Label>Technologies (comma-separated)</Label>
        <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Save experience
      </Button>
    </form>
  );
}

export function AboutAdmin({
  about,
  experiences,
}: {
  about: About | null;
  experiences: Experience[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);

  const form = useForm<AboutInput>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      bio: about?.bio ?? "",
      headline: about?.headline ?? "",
      resumeUrl: about?.resumeUrl ?? "",
      avatarUrl: about?.avatarUrl ?? "",
      location: about?.location ?? "",
      availability: about?.availability ?? "",
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">About & Experience</h1>
        <p className="text-sm text-muted-foreground">
          Update bio, resume link, and career timeline entries.
        </p>
      </div>

      <form
        className="space-y-4 rounded-xl border border-border bg-card/40 p-5"
        onSubmit={form.handleSubmit((values) => {
          setMessage(null);
          startTransition(async () => {
            const result = await upsertAbout(values);
            setMessage(result.success ? "About section saved." : result.error);
            if (result.success) router.refresh();
          });
        })}
      >
        <h2 className="text-lg font-semibold">Bio & resume</h2>
        <div className="space-y-2">
          <Label>Headline</Label>
          <Input {...form.register("headline")} />
        </div>
        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea rows={5} {...form.register("bio")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Resume URL</Label>
            <Input {...form.register("resumeUrl")} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Avatar URL</Label>
            <Input
              {...form.register("avatarUrl")}
              placeholder="/images/profile.jpg or https://..."
            />
            <p className="text-xs text-muted-foreground">
              Local file: put your photo in{" "}
              <code className="rounded bg-muted px-1">public/images/profile.jpg</code> then
              use <code className="rounded bg-muted px-1">/images/profile.jpg</code>. Or paste
              any image URL (GitHub, Cloudinary, etc.).
            </p>
            {form.formState.errors.avatarUrl ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.avatarUrl.message}
              </p>
            ) : null}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Location</Label>
            <Input {...form.register("location")} />
          </div>
          <div className="space-y-2">
            <Label>Availability</Label>
            <Input {...form.register("availability")} placeholder="Open to opportunities" />
          </div>
        </div>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          Save about
        </Button>
      </form>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Experience timeline</h2>
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
                Add experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit experience" : "New experience"}</DialogTitle>
              </DialogHeader>
              <ExperienceForm
                key={editing?.id ?? "new"}
                experience={editing ?? undefined}
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
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden lg:table-cell">Dates</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>
                    <p className="font-medium">{exp.role}</p>
                    <div className="mt-1 flex flex-wrap gap-1 md:hidden">
                      <Badge variant="outline">{exp.company}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{exp.company}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {format(new Date(exp.startDate), "MMM yyyy")} —{" "}
                    {exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : "Present"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditing(exp);
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
                            if (!confirm("Delete this experience?")) return;
                            await deleteExperience(exp.id);
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
          {experiences.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No experience entries yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
