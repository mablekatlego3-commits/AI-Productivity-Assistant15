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
          "FlowDesk AI writes emails, summarises meetings, prioritises tasks and answers workplace questions so professionals save time.",
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
    { label: "Emails generated", value: stats.email, icon: Mail },
    { label: "Meetings summarised", value: stats.summary, icon: CalendarCheck },
    { label: "Task plans created", value: stats.plan, icon: Sparkles },
    { label: "AI conversations", value: stats.chat, icon: MessageSquare },
  ];

  return (
    <AppLayout>
      <section className="surface-card shadow-elevated relative overflow-hidden p-6 sm:p-10">
        <div className="gradient-brand absolute inset-x-0 top-0 h-1.5" aria-hidden />
        <div
          className="ring-soft pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-2xl"
          aria-hidden
        />
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          <span className="animate-soft-pulse h-1.5 w-1.5 rounded-full bg-primary" />
          Welcome back, Katlego
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
          Your workday, <span className="text-gradient-brand">assisted by AI</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          FlowDesk AI is an AI-powered workplace productivity assistant. It drafts professional
          emails, summarises meetings into decisions and action items, prioritises your tasks and
          answers everyday workplace questions — so you spend less time on admin and more time on
          work that matters.
        </p>
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Button asChild size="lg" className="shadow-elevated transition-transform hover:-translate-y-0.5">
            <Link to="/email">
              Draft an email
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary/30 transition-transform hover:-translate-y-0.5 hover:bg-accent">
            <Link to="/summarizer">Summarise a meeting</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary/30 transition-transform hover:-translate-y-0.5 hover:bg-accent">
            <Link to="/planner">Plan my day</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary/30 transition-transform hover:-translate-y-0.5 hover:bg-accent">
            <Link to="/chat">Ask FlowDesk AI</Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Productivity statistics">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="surface-card card-lift animate-rise relative overflow-hidden p-5"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div
              className="ring-soft pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-xl"
              aria-hidden
            />
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <span className="gradient-brand flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground">
                <stat.icon className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-3 text-4xl font-extrabold tracking-tight">{stat.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
              this month
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ to, icon: Icon, title, text }, index) => (
            <Link
              key={to}
              to={to}
              style={{ animationDelay: `${index * 80}ms` }}
              className="surface-card card-lift animate-rise group relative flex flex-col gap-2 overflow-hidden p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div
                className="ring-soft pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <div className="gradient-brand flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="mt-1 text-base font-bold">{title}</h2>
              <p className="text-sm text-muted-foreground">{text}</p>
              <span className="mt-1 inline-flex items-center text-sm font-semibold text-primary">
                Open tool
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
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
