"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Check, MailOpen, Trash2 } from "lucide-react";
import type { Message } from "@prisma/client";
import { deleteMessage, markMessageRead } from "@/lib/actions/messages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MessagesAdmin({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">Contact form submissions inbox.</p>
      </div>

      <div className="rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id} className={message.read ? "opacity-70" : undefined}>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{message.name}</p>
                      {!message.read ? <Badge variant="success">New</Badge> : null}
                    </div>
                    <p className="text-xs text-muted-foreground">{message.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{message.subject}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{message.body}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {format(new Date(message.createdAt), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await markMessageRead(message.id, !message.read);
                          router.refresh();
                        })
                      }
                    >
                      {message.read ? <MailOpen className="size-4" /> : <Check className="size-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          if (!confirm("Delete this message?")) return;
                          await deleteMessage(message.id);
                          router.refresh();
                        })
                      }
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {messages.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Inbox is empty.</p>
        ) : null}
      </div>
    </div>
  );
}
