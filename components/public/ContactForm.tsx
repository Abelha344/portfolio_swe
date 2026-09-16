"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { messageSchema, type MessageInput } from "@/lib/validations";
import { submitContactMessage } from "@/lib/actions/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { name: "", email: "", subject: "", body: "" },
  });

  const onSubmit = (values: MessageInput) => {
    setStatus("idle");
    setError(null);
    startTransition(async () => {
      const result = await submitContactMessage(values);
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  };

  return (
    <section id="contact" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact</h2>
          <p className="mt-3 text-muted-foreground">
            Have a role, collaboration, or product idea? Send a message — I read every one.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} placeholder="Your name" />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="you@example.com"
              />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...form.register("subject")} placeholder="Your subject" />
            {form.formState.errors.subject ? (
              <p className="text-xs text-destructive">{form.formState.errors.subject.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              rows={5}
              {...form.register("body")}
              placeholder="Your message"
            />
            {form.formState.errors.body ? (
              <p className="text-xs text-destructive">{form.formState.errors.body.message}</p>
            ) : null}
          </div>

          {status === "success" ? (
            <p className="text-sm text-emerald-400">Message sent. I&apos;ll get back to you soon.</p>
          ) : null}
          {status === "error" && error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
