export const GROUNDING_RULE =
  "Never invent facts, names, dates, deadlines, numbers or decisions that are not present in the user's input. If required information is missing, explicitly say it was not provided.";

export function emailPrompt(input: {
  purpose: string;
  tone: string;
  length: string;
  recipient?: string | undefined;
}) {
  const lengthGuide: Record<string, string> = {
    Short: "3-5 sentences total",
    Medium: "2 short paragraphs",
    Detailed: "3-4 paragraphs with clear structure",
  };
  return [
    `Write a workplace email.`,
    input.recipient ? `Recipient: ${input.recipient}` : `Recipient: not specified.`,
    `Tone: ${input.tone}.`,
    `Length: ${lengthGuide[input.length] ?? "2 short paragraphs"}.`,
    `Purpose / key points provided by the user:\n"""${input.purpose}"""`,
    ``,
    `Rules:`,
    `- Output plain text only: a "Subject:" line, then the email body.`,
    `- Use [placeholders] for any detail the user did not provide (e.g. [Recipient Name], [Date]).`,
    `- ${GROUNDING_RULE}`,
  ].join("\n");
}

export function summaryPrompt(notes: string) {
  return [
    `You are summarising raw meeting notes or a transcript.`,
    `Return Markdown with exactly these sections, in this order:`,
    `## Summary`,
    `## Key Decisions`,
    `## Action Items`,
    `## Deadlines`,
    `## People Mentioned`,
    ``,
    `Rules:`,
    `- Use bullet points in every section except Summary.`,
    `- Only include an owner or deadline when it is explicitly stated in the notes.`,
    `- If a section has no supporting content, write "- Not mentioned in the notes".`,
    `- ${GROUNDING_RULE}`,
    ``,
    `Notes:\n"""${notes}"""`,
  ].join("\n");
}

export function plannerPrompt(tasks: string, workdayStart: string) {
  return [
    `You are a workplace task prioritisation assistant.`,
    `Here is the user's task list (one per line, may include optional deadline and estimated time):`,
    `"""${tasks}"""`,
    ``,
    `Return Markdown with exactly these sections:`,
    `## Prioritised Tasks`,
    `List every task as: **[HIGH|MEDIUM|LOW]** — task name — short reason (one line).`,
    `## Suggested Daily Schedule`,
    `A time-blocked schedule starting at ${workdayStart}, including short breaks.`,
    `## Notes`,
    `Any risks or conflicts you noticed.`,
    ``,
    `Rules:`,
    `- Only use the tasks, deadlines and durations the user supplied.`,
    `- ${GROUNDING_RULE}`,
  ].join("\n");
}

export const CHAT_SYSTEM_PROMPT = [
  "You are WorkMate AI, a concise and practical workplace productivity assistant.",
  "You help with meeting prep, prioritising workloads, drafting professional messages, structuring presentations and productivity advice.",
  "Answer in clean Markdown with short paragraphs, headings and bullet points where useful.",
  `Be honest about uncertainty. ${GROUNDING_RULE}`,
  "Never ask for or repeat confidential company information.",
].join(" ");
