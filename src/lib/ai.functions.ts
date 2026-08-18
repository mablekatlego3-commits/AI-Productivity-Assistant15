import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { emailPrompt, plannerPrompt, summaryPrompt } from "./ai-prompts";
import { runPrompt } from "./ai.server";

const EmailInput = z.object({
  purpose: z.string().min(1),
  tone: z.string().min(1),
  length: z.string().min(1),
  recipient: z.string().optional(),
});

const SummaryInput = z.object({ notes: z.string().min(1) });

const PlannerInput = z.object({
  tasks: z.string().min(1),
  workdayStart: z.string().min(1),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => runPrompt(emailPrompt(data)));

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummaryInput.parse(input))
  .handler(async ({ data }) => runPrompt(summaryPrompt(data.notes)));

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => runPrompt(plannerPrompt(data.tasks, data.workdayStart)));
