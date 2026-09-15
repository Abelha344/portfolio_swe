"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, GitBranch, Layers } from "lucide-react";
import type { Project } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Architecture = {
  overview?: string;
  layers?: { name: string; description: string; tech?: string[] }[];
  dataFlow?: string;
  infrastructure?: string;
};

export function ProjectCard({ project }: { project: Project }) {
  const architecture = (project.backendArchitecture ?? null) as Architecture | null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {project.featuredImage ? (
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-950 to-emerald-950 text-muted-foreground">
            <Layers className="size-10 opacity-40" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold tracking-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-primary">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 5 ? (
            <Badge variant="muted">+{project.techStack.length - 5}</Badge>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.liveUrl ? (
            <Button asChild size="sm" variant="default">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
                Live
              </a>
            </Button>
          ) : null}
          {project.repoUrl ? (
            <Button asChild size="sm" variant="outline">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <GitBranch className="size-3.5" />
                Code
              </a>
            </Button>
          ) : null}
          {architecture ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary">
                  <Layers className="size-3.5" />
                  Architecture
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>{project.title} — Architecture</DialogTitle>
                  <DialogDescription>
                    Technical breakdown of the system design and backend layers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  {architecture.overview ? (
                    <p className="text-muted-foreground">{architecture.overview}</p>
                  ) : null}
                  {architecture.layers?.map((layer) => (
                    <div key={layer.name} className="rounded-lg border border-border p-3">
                      <p className="font-medium">{layer.name}</p>
                      <p className="mt-1 text-muted-foreground">{layer.description}</p>
                      {layer.tech?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {layer.tech.map((t) => (
                            <Badge key={t} variant="muted">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                  {architecture.dataFlow ? (
                    <div>
                      <p className="font-medium">Data flow</p>
                      <p className="mt-1 text-muted-foreground">{architecture.dataFlow}</p>
                    </div>
                  ) : null}
                  {architecture.infrastructure ? (
                    <div>
                      <p className="font-medium">Infrastructure</p>
                      <p className="mt-1 text-muted-foreground">{architecture.infrastructure}</p>
                    </div>
                  ) : null}
                </div>
              </DialogContent>
            </Dialog>
          ) : null}
          <Button asChild size="sm" variant="ghost">
            <Link href={`/projects/${project.slug}`}>Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="scroll-mt-20 border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Projects</h2>
          <p className="mt-3 text-muted-foreground">
            Selected work across product engineering, ERP systems, and API platforms.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">Published projects will appear here.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
