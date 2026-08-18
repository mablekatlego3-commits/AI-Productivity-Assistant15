import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarCheck,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Menu,
  Settings,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/summarizer", label: "Meeting Summarizer", icon: CalendarCheck },
  { to: "/planner", label: "Task Planner", icon: Sparkles },
  { to: "/chat", label: "AI Workplace Chat", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <div className="gradient-brand flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground">
        <Sparkles className="h-4.5 w-4.5" aria-hidden />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold">WorkMate AI</p>
        <p className="text-xs text-muted-foreground">Productivity assistant</p>
      </div>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Main" className="flex flex-col gap-1 px-2">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ResponsibleAiNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-xl border border-border bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground",
        compact && "p-2.5",
      )}
    >
      <p className="mb-1 flex items-center gap-1.5 font-medium text-foreground">
        <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
        Responsible AI
      </p>
      <p>
        AI-generated content may contain errors. Always review and verify important information
        before using it for workplace communication or decision-making. Do not enter confidential or
        sensitive company information.
      </p>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <NavLinks />
        </div>
        <div className="p-3">
          <ResponsibleAiNotice compact />
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur lg:hidden">
        <Brand />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open navigation menu">
              <Menu className="h-5 w-5" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-16 items-center">
              <Brand />
            </div>
            <div className="py-2">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <div className="p-3">
              <ResponsibleAiNotice compact />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Mail;
}) {
  return (
    <header className="mb-6 flex items-start gap-3">
      <div className="gradient-brand hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground sm:flex">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
    </header>
  );
}
