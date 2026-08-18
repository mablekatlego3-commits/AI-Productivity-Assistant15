import { useCallback, useEffect, useState } from "react";

export type ActivityKind = "email" | "summary" | "plan" | "chat";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  title: string;
  at: string;
};

export type Stats = Record<ActivityKind, number>;

const STORAGE_KEY = "workmate-activity-v1";

const SEED: ActivityItem[] = [
  {
    id: "seed-1",
    kind: "email",
    title: "Client follow-up after product demo",
    at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "seed-2",
    kind: "summary",
    title: "Q3 planning sync — 14 action items",
    at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "seed-3",
    kind: "plan",
    title: "Daily schedule for 7 tasks",
    at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "seed-4",
    kind: "chat",
    title: "How to structure a stakeholder update",
    at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

const BASELINE: Stats = { email: 12, summary: 7, plan: 9, chat: 21 };

function read(): ActivityItem[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as ActivityItem[];
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
}

export function logActivity(kind: ActivityKind, title: string) {
  if (typeof window === "undefined") return;
  const next = [
    { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, kind, title, at: new Date().toISOString() },
    ...read(),
  ].slice(0, 25);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("workmate-activity"));
}

export function clearActivity() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("workmate-activity"));
}

export function useActivity() {
  const [items, setItems] = useState<ActivityItem[]>([]);

  const sync = useCallback(() => setItems(read()), []);

  useEffect(() => {
    sync();
    window.addEventListener("workmate-activity", sync);
    return () => window.removeEventListener("workmate-activity", sync);
  }, [sync]);

  const stats: Stats = { ...BASELINE };
  for (const item of items) {
    if (item.id.startsWith("seed-")) continue;
    stats[item.kind] += 1;
  }

  return { items, stats };
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}
