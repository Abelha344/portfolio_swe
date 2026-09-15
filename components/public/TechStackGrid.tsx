"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Skill, SkillCategory } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const categories: { value: SkillCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "DATABASE", label: "Databases" },
  { value: "DEVOPS", label: "DevOps" },
];

export function TechStackGrid({ skills }: { skills: Skill[] }) {
  const [tab, setTab] = useState<string>("ALL");

  const filtered = useMemo(() => {
    if (tab === "ALL") return skills;
    return skills.filter((s) => s.category === tab);
  }, [skills, tab]);

  return (
    <section id="tech" className="scroll-mt-20 border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tech Stack</h2>
          <p className="mt-3 text-muted-foreground">
            Tools I use to design APIs, ship interfaces, and operate production systems.
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            {categories.map((c) => (
              <TabsTrigger key={c.value} value={c.value}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={tab} forceMount>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.length === 0 ? (
                  <p className="col-span-full text-sm text-muted-foreground">
                    No skills in this category yet.
                  </p>
                ) : (
                  filtered.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{skill.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {skill.yearsOfExp} yrs experience
                          </p>
                        </div>
                        <Badge variant="muted">{skill.category}</Badge>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400"
                        />
                      </div>
                      <p className="mt-2 text-right text-xs text-muted-foreground">
                        {skill.proficiency}%
                      </p>
                    </div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
