import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout, PageHeader, ResponsibleAiNotice } from "@/components/AppLayout";
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
import { Switch } from "@/components/ui/switch";
import { clearActivity } from "@/lib/stats";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | WorkMate AI" },
      {
        name: "description",
        content: "Manage your WorkMate AI workspace preferences, defaults and stored activity.",
      },
      { property: "og:title", content: "Settings | WorkMate AI" },
      {
        property: "og:description",
        content: "Workspace preferences and defaults for WorkMate AI.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("Katlego");
  const [role, setRole] = useState("Project Coordinator");
  const [tone, setTone] = useState("Professional");
  const [confirmSensitive, setConfirmSensitive] = useState(true);

  return (
    <AppLayout>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Personalise WorkMate AI defaults and manage the activity stored in this browser."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="surface-card space-y-4 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("Preferences saved");
          }}
        >
          <h2 className="text-sm font-semibold">Profile & defaults</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Job title</Label>
            <Input id="role" value={role} onChange={(event) => setRole(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-tone">Default email tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="default-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Formal", "Friendly", "Persuasive", "Professional"].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
            <Label htmlFor="sensitive" className="text-sm font-normal">
              Show sensitive-data reminder before generating
            </Label>
            <Switch id="sensitive" checked={confirmSensitive} onCheckedChange={setConfirmSensitive} />
          </div>
          <Button type="submit">Save preferences</Button>
        </form>

        <div className="space-y-6">
          <section className="surface-card space-y-3 p-5">
            <h2 className="text-sm font-semibold">Data & privacy</h2>
            <p className="text-sm text-muted-foreground">
              WorkMate AI stores your recent activity locally in this browser only. Prompts are sent
              to the AI provider to generate results and are not used to train models.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                clearActivity();
                toast.success("Recent activity cleared");
              }}
            >
              Clear recent activity
            </Button>
          </section>

          <ResponsibleAiNotice />
        </div>
      </div>
    </AppLayout>
  );
}
