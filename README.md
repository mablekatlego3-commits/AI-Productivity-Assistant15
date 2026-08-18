# WorkMate AI

Build a modern, professional, responsive web application called WorkMate AI.

WorkWise AI is an AI-powered workplace productivity assistant that helps professionals save time by automating common workplace tasks.

CORE FEATURES

The application must contain these four AI-powered tools:

1. Smart Email Generator

Create a tool where users can:

Enter the purpose or key points of an email

Select a tone: Formal, Friendly, Persuasive, or Professional

Select an email length: Short, Medium, or Detailed

Generate a professional email using AI

Edit the generated email

Copy the result

Regenerate the response

2. Meeting Notes Summarizer

Create a tool where users can:

Paste meeting notes or a transcript

Generate an AI summary

Extract key decisions

Extract action items

Identify deadlines

Identify responsible people when they are explicitly mentioned

Display the information in clearly separated sections

Allow the user to edit and copy the generated results

The AI must not invent names, deadlines, decisions, or information that is not contained in the user's notes.

3. AI Task Planner

Create a tool where users can:

Enter multiple workplace tasks

Add optional deadlines

Add estimated time

Generate an AI-prioritized task list

Categorize tasks as High, Medium, or Low priority

Generate a suggested daily schedule

Display tasks in an easy-to-read format

Allow users to edit, complete, or remove tasks

4. Workplace AI Chat

Create an interactive AI chatbot for workplace productivity.

Users should be able to ask questions such as:

Help me prepare for a meeting

Help me prioritize my workload

Draft a professional response

Help me structure a presentation

Give me productivity suggestions

Include:

Chat history

User and AI message styling

Clear chat button

Copy response button

Suggested starter prompts

DASHBOARD

Create a professional dashboard homepage containing:

Welcome message

Short description of WorkMate AI

Four feature cards

Recent activity section

Quick action buttons

Simple productivity statistics

Example statistics:

Emails generated

Meetings summarized

Tasks planned

AI conversations

NAVIGATION

Create a responsive sidebar containing:

Dashboard

Email Generator

Meeting Summarizer

Task Planner

AI Workplace Chat

Settings

On mobile devices, the sidebar should collapse into a mobile navigation menu.

DESIGN

Use a clean, modern SaaS-style design.

Design characteristics:

Professional

Minimal

Modern

Easy to navigate

Good spacing

Rounded cards

Subtle shadows

Clear typography

Accessible color contrast

Responsive on desktop, tablet, and mobile

Use a professional blue/purple accent color with a neutral background.

Create a consistent visual design across every page.

AI OUTPUT DESIGN

AI-generated results should appear inside professional output cards.

Each output card should include:

AI-generated content

Edit button

Copy button

Regenerate button where appropriate

Include loading states while AI responses are being generated.

Include helpful error messages if generation fails.

RESPONSIBLE AI

Include a visible Responsible AI disclaimer in the application:

"AI-generated content may contain errors. Always review and verify important information before using it for workplace communication or decision-making."

Also remind users not to enter confidential or sensitive company information.

The AI should clearly avoid inventing information when the required information is not provided.

ACCESSIBILITY AND UX

Include:

Clear labels

Helpful placeholders

Empty states

Loading indicators

Error states

Keyboard-friendly controls

Responsive layouts

Clear success feedback after copying content

TECHNICAL REQUIREMENTS

Build the application using a modern React-based architecture with reusable components.

Keep the code clean, organized, and maintainable.

Separate UI components from AI functionality where appropriate.

Make sure the application is functional rather than only a visual mockup.

Create realistic sample data where necessary for the dashboard.

The final result should be a polished workplace SaaS product suitable for a AI project presentation.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://workmate-ai-buddy-48.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/beecd9a0-6fdd-4120-9d89-d8291ddda823).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
