"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Experience } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="scroll-mt-20 border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Experience</h2>
          <p className="mt-3 text-muted-foreground">
            Career highlights across full-stack product delivery and ERP engineering.
          </p>
        </div>

        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">Experience entries will appear here.</p>
        ) : (
          <ol className="relative space-y-8 border-l border-border pl-6 sm:pl-8">
            {experiences.map((exp, index) => (
              <motion.li
                key={exp.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="relative"
              >
                <span className="absolute -left-[1.9rem] top-1.5 size-3 rounded-full border-2 border-background bg-primary sm:-left-[2.4rem]" />
                <div className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.role}</h3>
                      <p className="text-sm text-primary">{exp.company}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(exp.startDate), "MMM yyyy")} —{" "}
                      {exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : "Present"}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {exp.description}
                  </p>
                  {exp.technologies.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
