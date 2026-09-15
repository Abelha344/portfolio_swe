import { getAllProjects } from "@/lib/actions/projects";
import { ProjectsAdmin } from "@/components/admin/ProjectsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();
  return <ProjectsAdmin initialProjects={projects} />;
}
