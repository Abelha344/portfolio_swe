import { getMessages } from "@/lib/actions/messages";
import { MessagesAdmin } from "@/components/admin/MessagesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  return <MessagesAdmin messages={messages} />;
}
