import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react";
import { getProjectBySlug } from "@/lib/actions/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Architecture = {
  overview?: string;
  layers?: { name: string; description: string; tech?: string[] }[];
  dataFlow?: string;
  infrastructure?: string;
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) notFound();

  const architecture = (project.backendArchitecture ?? null) as Architecture | null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Button asChild variant="ghost" className="mb-6 -ml-2">
        <Link href="/#projects">
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>
      </Button>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{project.summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.liveUrl ? (
          <Button asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
              Live demo
            </a>
          </Button>
        ) : null}
        {project.repoUrl ? (
          <Button asChild variant="outline">
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <GitBranch className="size-4" />
              Repository
            </a>
          </Button>
        ) : null}
      </div>

      {project.featuredImage ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-border">
          <Image
            src={project.featuredImage}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
      ) : null}

      <div className="prose prose-invert mt-10 max-w-none prose-p:text-muted-foreground prose-headings:text-foreground">
        <ReactMarkdown>{project.description}</ReactMarkdown>
      </div>

      {architecture ? (
        <section className="mt-12 rounded-xl border border-border bg-card/50 p-5 sm:p-6">
          <h2 className="text-xl font-semibold">System architecture</h2>
          {architecture.overview ? (
            <p className="mt-3 text-sm text-muted-foreground">{architecture.overview}</p>
          ) : null}
          <div className="mt-4 space-y-3">
            {architecture.layers?.map((layer) => (
              <div key={layer.name} className="rounded-lg border border-border p-4">
                <h3 className="font-medium">{layer.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{layer.description}</p>
                {layer.tech?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {layer.tech.map((t) => (
                      <Badge key={t} variant="muted">
                        {t}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {architecture.dataFlow ? (
            <div className="mt-4">
              <h3 className="font-medium">Data flow</h3>
              <p className="mt-1 text-sm text-muted-foreground">{architecture.dataFlow}</p>
            </div>
          ) : null}
          {architecture.infrastructure ? (
            <div className="mt-4">
              <h3 className="font-medium">Infrastructure</h3>
              <p className="mt-1 text-sm text-muted-foreground">{architecture.infrastructure}</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </article>
  );
}
