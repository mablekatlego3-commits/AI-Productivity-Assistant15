import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Mail,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AppLayout, ResponsibleAiNotice } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { timeAgo, useActivity, type ActivityKind } from "@/lib/stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowDesk AI — Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "FlowDesk AI writes emails, summarises meetings, prioritises tasks and answers workplace questions so professionals save time.",
      },
      { property: "og:title", content: "FlowDesk AI — Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise meetings, plan tasks and chat with an AI workplace assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    text: "Turn key points into a polished email with the right tone and length.",
  },
  {
    to: "/summarizer" as const,
    icon: CalendarCheck,
    title: "Meeting Notes Summarizer",
    text: "Extract decisions, action items, deadlines and owners from raw notes.",
  },
  {
    to: "/planner" as const,
    icon: Sparkles,
    title: "AI Task Planner",
    text: "Prioritise your workload and get a realistic daily schedule.",
  },
  {
    to: "/chat" as const,
    icon: MessageSquare,
    title: "Workplace AI Chat",
    text: "Ask for meeting prep, professional replies and productivity advice.",
  },
];

const ACTIVITY_META: Record<ActivityKind, { label: string; icon: typeof Mail }> = {
  email: { label: "Email generated", icon: Mail },
  summary: { label: "Meeting summarised", icon: CalendarCheck },
  plan: { label: "Tasks planned", icon: Sparkles },
  chat: { label: "AI conversation", icon: MessageSquare },
};

function Dashboard() {
  const { items, stats } = useActivity();

  const statCards = [
    { label: "Emails generated", value: stats.email },
    { label: "Meetings summarised", value: stats.summary },
    { label: "Task plans created", value: stats.plan },
    { label: "AI conversations", value: stats.chat },
  ];

  return (
    <AppLayout>
      <section className="surface-card relative overflow-hidden p-6 sm:p-8">
        <div className="gradient-brand absolute inset-x-0 top-0 h-1" aria-hidden />
        <p className="text-sm font-medium text-primary">Welcome back, Katlego</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your workday, <span className="text-gradient-brand">assisted by AI</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          FlowDesk AI is an AI-powered workplace productivity assistant. It drafts professional
          emails, summarises meetings into decisions and action items, prioritises your tasks and
          answers everyday workplace questions — so you spend less time on admin and more time on
          work that matters.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/email">
              Draft an email
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/summarizer">Summarise a meeting</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/planner">Plan my day</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/chat">Ask FlowDesk AI</Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Productivity statistics">
        {statCards.map((stat) => (
          <div key={stat.label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <TrendingUp className="h-4 w-4 text-primary" aria-hidden />
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">this month</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ to, icon: Icon, title, text }) => (
            <Link
              key={to}
              to={to}
              className="surface-card group flex flex-col gap-2 p-5 transition-shadow hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="gradient-brand flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="mt-1 text-base font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{text}</p>
              <span className="mt-1 inline-flex items-center text-sm font-medium text-primary">
                Open tool
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>

        <div className="space-y-6">
          <section className="surface-card p-5" aria-label="Recent activity">
            <h2 className="text-sm font-semibold">Recent activity</h2>
            {items.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No activity yet. Generate something to see it here.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {items.slice(0, 6).map((item) => {
                  const meta = ACTIVITY_META[item.kind];
                  const Icon = meta.icon;
                  return (
                    <li key={item.id} className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Icon className="h-4 w-4" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {meta.label} · {timeAgo(item.at)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <ResponsibleAiNotice />
        </div>
      </section>
    </AppLayout>
  );
}
