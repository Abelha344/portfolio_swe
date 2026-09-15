import { getSkills } from "@/lib/actions/skills";
import { SkillsAdmin } from "@/components/admin/SkillsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();
  return <SkillsAdmin initialSkills={skills} />;
}
