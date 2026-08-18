import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck } from "lucide-react";
import { useState } from "react";
import { AppLayout, PageHeader, ResponsibleAiNotice } from "@/components/AppLayout";
import { EmptyState, ErrorState, OutputCard, OutputSkeleton } from "@/components/OutputCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotes } from "@/lib/ai.functions";
import { logActivity } from "@/lib/stats";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | WorkMate AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary with decisions, action items, deadlines and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | WorkMate AI" },
      {
        property: "og:description",
        content: "Summarise meetings into decisions, action items and deadlines with WorkMate AI.",
      },
    ],
  }),
  component: SummarizerPage,
});

const SAMPLE = `Weekly product sync — Tuesday
Priya said the checkout redesign is blocked until legal signs off.
Legal review is due Friday 22 August.
Team agreed to postpone the pricing experiment to September.
Tom will prepare the migration checklist by Thursday.
Open question: who owns customer comms? Not decided.`;

function SummarizerPage() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");

  const summarize = useServerFn(summarizeNotes);
  const mutation = useMutation({
    mutationFn: (value: string) => summarize({ data: { notes: value } }),
    onSuccess: (data) => {
      setResult(data.text);
      logActivity("summary", notes.split("\n")[0]?.slice(0, 60) || "Meeting summary");
    },
  });

  const submit = () => {
    if (!notes.trim()) return;
    mutation.mutate(notes);
  };

  return (
    <AppLayout>
      <PageHeader
        icon={CalendarCheck}
        title="Meeting Notes Summarizer"
        description="Paste notes or a transcript to get a summary, key decisions, action items, deadlines and the people explicitly mentioned."
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
            <div className="flex items-center justify-between">
              <Label htmlFor="notes">Meeting notes or transcript</Label>
              <button
                type="button"
                onClick={() => setNotes(SAMPLE)}
                className="text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                Load sample
              </button>
            </div>
            <Textarea
              id="notes"
              required
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Paste your raw meeting notes here…"
              className="min-h-72"
            />
            <p className="text-xs text-muted-foreground">
              Owners and deadlines are only extracted when they are stated in your notes.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={mutation.isPending || !notes.trim()}>
            {mutation.isPending ? "Summarising…" : "Summarise notes"}
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
              title="Meeting breakdown"
              value={result}
              onChange={setResult}
              onRegenerate={submit}
              regenerating={mutation.isPending}
            />
          ) : null}
          {!mutation.isPending && !result && !mutation.isError ? (
            <EmptyState
              icon={<CalendarCheck className="h-5 w-5" aria-hidden />}
              title="No summary yet"
              hint="Paste your meeting notes and generate a structured breakdown you can edit and copy."
            />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
