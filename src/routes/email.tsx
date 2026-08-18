import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail } from "lucide-react";
import { useState } from "react";
import { AppLayout, PageHeader, ResponsibleAiNotice } from "@/components/AppLayout";
import { EmptyState, ErrorState, OutputCard, OutputSkeleton } from "@/components/OutputCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";
import { logActivity } from "@/lib/stats";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | FlowDesk AI" },
      {
        name: "description",
        content:
          "Turn a few key points into a polished workplace email with a chosen tone and length.",
      },
      { property: "og:title", content: "Smart Email Generator | FlowDesk AI" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in seconds with FlowDesk AI.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive", "Professional"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [result, setResult] = useState("");

  const generate = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: (vars: { purpose: string; tone: string; length: string; recipient: string }) =>
      generate({ data: vars }),
    onSuccess: (data) => {
      setResult(data.text);
      logActivity("email", purpose.slice(0, 60) || "Email draft");
    },
  });

  const submit = () => {
    if (!purpose.trim()) return;
    mutation.mutate({ purpose, tone, length, recipient });
  };

  return (
    <AppLayout>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the purpose and key points, choose a tone and length, and FlowDesk AI drafts the email for you."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form
          className="surface-card space-y-4 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose or key points</Label>
            <Textarea
              id="purpose"
              required
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              placeholder="e.g. Ask the design team to move the review to Thursday because the client feedback arrives Wednesday."
              className="min-h-40"
            />
            <p className="text-xs text-muted-foreground">
              Anything you leave out will be shown as a [placeholder] instead of being invented.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient (optional)</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="e.g. Design team lead"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger id="length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={mutation.isPending || !purpose.trim()}>
            {mutation.isPending ? "Generating…" : "Generate email"}
          </Button>

          <ResponsibleAiNotice compact />
        </form>

        <div className="space-y-4">
          {mutation.isPending ? <OutputSkeleton /> : null}
          {mutation.isError && !mutation.isPending ? (
            <ErrorState message={(mutation.error as Error).message} onRetry={submit} />
          ) : null}
          {!mutation.isPending && result ? (
            <OutputCard
              title="Generated email"
              value={result}
              onChange={setResult}
              onRegenerate={submit}
              regenerating={mutation.isPending}
              render="text"
            />
          ) : null}
          {!mutation.isPending && !result && !mutation.isError ? (
            <EmptyState
              icon={<Mail className="h-5 w-5" aria-hidden />}
              title="No email generated yet"
              hint="Fill in the purpose on the left and generate a draft. You can edit, copy and regenerate the result."
            />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
