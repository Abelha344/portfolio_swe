import { Hero } from "@/components/public/Hero";
import { TechStackGrid } from "@/components/public/TechStackGrid";
import { ProjectsShowcase } from "@/components/public/ProjectCard";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { ContactForm } from "@/components/public/ContactForm";
import { getPublishedProjects } from "@/lib/actions/projects";
import { getSkills } from "@/lib/actions/skills";
import { getExperiences } from "@/lib/actions/experience";
import { getAbout } from "@/lib/actions/messages";

export const dynamic = "force-dynamic";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [projects, skills, experiences, about] = await Promise.all([
    safeQuery(() => getPublishedProjects(), []),
    safeQuery(() => getSkills(), []),
    safeQuery(() => getExperiences(), []),
    safeQuery(() => getAbout(), null),
  ]);

  return (
    <>
      <Hero
        headline={about?.headline}
        bio={about?.bio}
        resumeUrl={about?.resumeUrl}
        avatarUrl={about?.avatarUrl}
        linkedinUrl={about?.linkedinUrl}
        githubUrl={about?.githubUrl}
        email={about?.email}
      />
      <TechStackGrid skills={skills} />
      <ProjectsShowcase projects={projects} />
      <ExperienceTimeline experiences={experiences} />
      <ContactForm />
    </>
  );
}
