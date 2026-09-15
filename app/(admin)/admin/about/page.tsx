import { getAbout } from "@/lib/actions/messages";
import { getExperiences } from "@/lib/actions/experience";
import { AboutAdmin } from "@/components/admin/AboutAdmin";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const [about, experiences] = await Promise.all([getAbout(), getExperiences()]);
  return <AboutAdmin about={about} experiences={experiences} />;
}
