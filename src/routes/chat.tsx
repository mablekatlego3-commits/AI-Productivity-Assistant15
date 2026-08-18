import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Check, Copy, MessageSquare, Send, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { AppLayout, PageHeader, ResponsibleAiNotice } from "@/components/AppLayout";
import { ErrorState, useCopy } from "@/components/OutputCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { logActivity } from "@/lib/stats";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Workplace AI Chat | WorkMate AI" },
      {
        name: "description",
        content:
          "Chat with WorkMate AI for meeting prep, prioritising workloads, drafting replies and presentation structure.",
      },
      { property: "og:title", content: "Workplace AI Chat | WorkMate AI" },
      {
        property: "og:description",
        content: "An AI assistant for everyday workplace productivity questions.",
      },
    ],
  }),
  component: ChatPage,
});

const STARTERS = [
  "Help me prepare for a client kickoff meeting tomorrow",
  "Help me prioritise a workload of 8 competing tasks",
  "Draft a professional response declining a meeting invite",
  "Help me structure a 10-minute project update presentation",
  "Give me productivity suggestions for a heavy admin week",
];

function MessageBubble({ role, text }: { role: string; text: string }) {
  const { copied, copy } = useCopy();
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? "gradient-brand text-primary-foreground"
            : "surface-card text-foreground"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        ) : (
          <>
            <div className="markdown-body">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
            <div className="mt-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => copy(text)}>
                {copied ? (
                  <Check className="mr-1.5 h-3.5 w-3.5 text-success" aria-hidden />
                ) : (
                  <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ChatPage() {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport,
    onError: () => toast.error("The assistant could not respond. Please try again."),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    void sendMessage({ text: value });
    setInput("");
    logActivity("chat", value.slice(0, 60));
  };

  return (
    <AppLayout>
      <PageHeader
        icon={MessageSquare}
        title="Workplace AI Chat"
        description="Ask WorkMate AI for help with meetings, workload, professional writing and productivity."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section
          className="surface-card flex h-[68vh] min-h-125 flex-col overflow-hidden"
          aria-label="Chat conversation"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Conversation</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMessages([]);
                toast.success("Chat cleared");
              }}
              disabled={messages.length === 0}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Clear chat
            </Button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <MessageSquare className="h-5 w-5" aria-hidden />
                </div>
                <p className="text-sm font-medium">Start a conversation</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Pick a suggested prompt or type your own workplace question below.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  text={message.parts
                    .map((part) => (part.type === "text" ? part.text : ""))
                    .join("")}
                />
              ))
            )}

            {status === "submitted" ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
                WorkMate AI is thinking…
              </div>
            ) : null}

            {error ? <ErrorState message="The assistant could not respond." /> : null}
            <div ref={endRef} />
          </div>

          <form
            className="border-t border-border p-3"
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-end gap-2">
              <Textarea
                aria-label="Message WorkMate AI"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask about meetings, workload, writing or productivity…"
                className="max-h-40 min-h-11 resize-none"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="surface-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Suggested prompts</h2>
            <div className="space-y-2">
              {STARTERS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => send(prompt)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-border px-3 py-2 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
          <ResponsibleAiNotice />
        </aside>
      </div>
    </AppLayout>
  );
}
