"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Download, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroProps = {
  headline?: string | null;
  bio?: string | null;
  resumeUrl?: string | null;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  email?: string | null;
};

const FALLBACK_AVATAR = "/images/profile.jpg";
const FALLBACK_GITHUB = "https://github.com/Abelha344";
const FALLBACK_EMAIL = "abelhailu0427@gmail.com";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Hero({
  headline,
  bio,
  resumeUrl,
  avatarUrl,
  linkedinUrl,
  githubUrl,
  email,
}: HeroProps) {
  const github = githubUrl || FALLBACK_GITHUB;
  const linkedin = linkedinUrl || github;
  const contactEmail = email || FALLBACK_EMAIL;

  return (
    <section id="hero" className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.15),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(34,197,94,0.08),_transparent_40%)]" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55 }}
          className="relative mb-8"
        >
          <div className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-br from-sky-400/35 via-transparent to-emerald-400/25 blur-2xl" />
          <div className="relative size-40 overflow-hidden rounded-full border-2 border-border shadow-[0_0_0_6px_rgba(13,20,32,0.85)] sm:size-48 md:size-56">
            <Image
              src={avatarUrl || FALLBACK_AVATAR}
              alt="Abel Hailu"
              fill
              priority
              sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
        >
          <Sparkles className="size-3.5 text-primary" />
          Available for full-stack & ERP engineering roles
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
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
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {bio ||
            "Specializing in Next.js, React, Express, Nest.js, Django, FastAPI, PostgreSQL, MySQL, and MongoDB — shipping end-to-end systems with clean architecture and measurable impact."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg">
            <a href="#projects">
              View Projects
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="size-4" />
              LinkedIn
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="size-4" />
              GitHub
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={`mailto:${contactEmail}`}>
              <Mail className="size-4" />
              Email
            </a>
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
    </section>
  );
}
