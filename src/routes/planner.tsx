import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppLayout, PageHeader, ResponsibleAiNotice } from "@/components/AppLayout";
import { EmptyState, ErrorState, OutputCard, OutputSkeleton } from "@/components/OutputCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { planTasks } from "@/lib/ai.functions";
import { logActivity } from "@/lib/stats";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | FlowDesk AI" },
      {
        name: "description",
        content:
          "Enter your workplace tasks and get an AI-prioritised list plus a suggested daily schedule.",
      },
      { property: "og:title", content: "AI Task Planner | FlowDesk AI" },
      {
        property: "og:description",
        content: "Prioritise your workload and build a daily schedule with FlowDesk AI.",
      },
    ],
  }),
  component: PlannerPage,
});

type Task = {
  id: string;
  name: string;
  deadline: string;
  estimate: string;
  done: boolean;
};

const INITIAL: Task[] = [
  { id: "t1", name: "Finish Q3 budget review", deadline: "2026-08-20", estimate: "2h", done: false },
  { id: "t2", name: "Reply to client onboarding email", deadline: "", estimate: "20m", done: false },
  { id: "t3", name: "Prepare team stand-up agenda", deadline: "2026-08-19", estimate: "30m", done: false },
];

function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [estimate, setEstimate] = useState("");
  const [start, setStart] = useState("09:00");
  const [result, setResult] = useState("");

  const plan = useServerFn(planTasks);
  const mutation = useMutation({
    mutationFn: (payload: { tasks: string; workdayStart: string }) => plan({ data: payload }),
    onSuccess: (data) => {
      setResult(data.text);
      logActivity("plan", `Plan for ${tasks.filter((t) => !t.done).length} tasks`);
    },
  });

  const addTask = () => {
    if (!name.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: `${Date.now()}`, name: name.trim(), deadline, estimate: estimate.trim(), done: false },
    ]);
    setName("");
    setDeadline("");
    setEstimate("");
  };

  const submit = () => {
    const open = tasks.filter((task) => !task.done);
    if (open.length === 0) return;
    const lines = open
      .map(
        (task) =>
          `- ${task.name}${task.deadline ? ` | deadline: ${task.deadline}` : ""}${
            task.estimate ? ` | estimated time: ${task.estimate}` : ""
          }`,
      )
      .join("\n");
    mutation.mutate({ tasks: lines, workdayStart: start });
  };

  const openCount = tasks.filter((task) => !task.done).length;

  return (
    <AppLayout>
      <PageHeader
        icon={Sparkles}
        title="AI Task Planner"
        description="Add your tasks with optional deadlines and estimates, then let FlowDesk AI prioritise them and build a suggested daily schedule."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <form
            className="surface-card space-y-4 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              addTask();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="task-name">Task</Label>
              <Input
                id="task-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Draft the sprint retrospective summary"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="task-deadline">Deadline (optional)</Label>
                <Input
                  id="task-deadline"
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-estimate">Estimated time (optional)</Label>
                <Input
                  id="task-estimate"
                  value={estimate}
                  onChange={(event) => setEstimate(event.target.value)}
                  placeholder="e.g. 45m"
                />
              </div>
            </div>
            <Button type="submit" variant="outline" className="w-full" disabled={!name.trim()}>
              <Plus className="mr-1.5 h-4 w-4" aria-hidden />
              Add task
            </Button>
          </form>

          <section className="surface-card p-5" aria-label="Your tasks">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Your tasks</h2>
              <span className="text-xs text-muted-foreground">{openCount} open</span>
            </div>
            {tasks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No tasks yet. Add your first task above.
              </p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start gap-3 rounded-lg border border-border px-3 py-2.5"
                  >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.done}
                      onCheckedChange={(checked) =>
                        setTasks((prev) =>
                          prev.map((item) =>
                            item.id === task.id ? { ...item, done: checked === true } : item,
                          ),
                        )
                      }
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor={`task-${task.id}`}
                        className={cn(
                          "block text-sm font-medium",
                          task.done && "text-muted-foreground line-through",
                        )}
                      >
                        {task.name}
                      </label>
                      {task.deadline || task.estimate ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {[task.deadline && `Due ${task.deadline}`, task.estimate]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${task.name}`}
                      onClick={() => setTasks((prev) => prev.filter((item) => item.id !== task.id))}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" aria-hidden />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 space-y-2">
              <Label htmlFor="start">Workday starts at</Label>
              <Input
                id="start"
                type="time"
                value={start}
                onChange={(event) => setStart(event.target.value)}
              />
            </div>

            <Button
              className="mt-4 w-full"
              onClick={submit}
              disabled={mutation.isPending || openCount === 0}
            >
              {mutation.isPending ? "Planning…" : "Generate prioritised plan"}
            </Button>
          </section>

          <ResponsibleAiNotice compact />
        </div>

        <div className="space-y-4">
          {mutation.isPending ? <OutputSkeleton /> : null}
          {mutation.isError && !mutation.isPending ? (
            <ErrorState message={(mutation.error as Error).message} onRetry={submit} />
          ) : null}
          {!mutation.isPending && result ? (
            <OutputCard
              title="Prioritised plan & schedule"
              value={result}
              onChange={setResult}
              onRegenerate={submit}
              regenerating={mutation.isPending}
            />
          ) : null}
          {!mutation.isPending && !result && !mutation.isError ? (
            <EmptyState
              icon={<Sparkles className="h-5 w-5" aria-hidden />}
              title="No plan generated yet"
              hint="Add your open tasks and generate a prioritised list with a suggested daily schedule."
            />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
