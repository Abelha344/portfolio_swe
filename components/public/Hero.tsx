"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroProps = {
  headline?: string | null;
  bio?: string | null;
  resumeUrl?: string | null;
  avatarUrl?: string | null;
};

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";

export function Hero({ headline, bio, resumeUrl, avatarUrl }: HeroProps) {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.15),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(34,197,94,0.08),_transparent_40%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 md:flex-row md:items-center md:justify-between md:gap-12 lg:gap-16">
        <div className="min-w-0 flex-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <Sparkles className="size-3.5 text-primary" />
            Available for full-stack & ERP engineering roles
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {headline || (
              <>
                Full-Stack Developer building{" "}
                <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                  resilient products
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {bio ||
              "Specializing in Next.js, React, Express, Nest.js, Django, FastAPI, PostgreSQL, MySQL, and MongoDB — shipping end-to-end systems with clean architecture and measurable impact."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <a href="#projects">
                View Projects
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#contact">Get in Touch</a>
            </Button>
            {resumeUrl ? (
              <Button asChild variant="secondary" size="lg">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="size-4" />
                  Resume
                </a>
              </Button>
            ) : null}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="relative shrink-0"
        >
          <div className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-br from-sky-400/35 via-transparent to-emerald-400/25 blur-2xl" />
          <div className="relative size-48 overflow-hidden rounded-full border-2 border-border shadow-[0_0_0_6px_rgba(13,20,32,0.85)] sm:size-56 md:size-64 lg:size-72">
            <Image
              src={avatarUrl || FALLBACK_AVATAR}
              alt="Abel Hailu"
              fill
              priority
              sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
