import { Check, Copy, Pencil, RefreshCw, Save } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export function OutputSkeleton() {
  return (
    <div className="surface-card space-y-3 p-5" aria-busy="true" aria-live="polite">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-11/12" />
      <Skeleton className="h-3 w-9/12" />
      <Skeleton className="h-3 w-10/12" />
      <p className="pt-1 text-xs text-muted-foreground">WorkMate AI is generating your result…</p>
    </div>
  );
}

export function EmptyState({ icon, title, hint }: { icon: ReactNode; title: string; hint: string }) {
  return (
    <div className="surface-card flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        {icon}
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
    >
      <p className="font-medium">Generation failed</p>
      <p className="mt-1 text-destructive/90">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function useCopy() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy. Please select and copy manually.");
    }
  };

  return { copied, copy };
}

export function OutputCard({
  title,
  value,
  onChange,
  onRegenerate,
  regenerating,
  render = "markdown",
}: {
  title: string;
  value: string;
  onChange: (next: string) => void;
  onRegenerate?: () => void;
  regenerating?: boolean;
  render?: "markdown" | "text";
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const { copied, copy } = useCopy();

  useEffect(() => {
    setDraft(value);
    setEditing(false);
  }, [value]);

  return (
    <section className="surface-card overflow-hidden" aria-label={title}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <Button
              size="sm"
              onClick={() => {
                onChange(draft);
                setEditing(false);
                toast.success("Changes saved");
              }}
            >
              <Save className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Save
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Edit
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => copy(editing ? draft : value)}>
            {copied ? (
              <Check className="mr-1.5 h-3.5 w-3.5 text-success" aria-hidden />
            ) : (
              <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          {onRegenerate ? (
            <Button size="sm" variant="outline" onClick={onRegenerate} disabled={regenerating}>
              <RefreshCw
                className={`mr-1.5 h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`}
                aria-hidden
              />
              Regenerate
            </Button>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        {editing ? (
          <Textarea
            aria-label={`Edit ${title}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-72 font-mono text-sm"
          />
        ) : render === "markdown" ? (
          <div className="markdown-body text-sm text-foreground">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
            {value}
          </pre>
        )}
      </div>
    </section>
  );
}
