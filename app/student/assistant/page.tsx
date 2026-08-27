"use client";

import { FormEvent, useState } from "react";
import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";

const prompts = [
  "How can I become eligible for this drive?",
  "What should I fix in my resume?",
  "Which drives match my current profile?"
];

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant" as const,
    text: "Hi Aafreen. I can help you understand eligibility, improve your resume, or find drives that fit your profile."
  }
];

const responses = [
  "I can help with that. Start by checking the drive requirements and comparing them with your current academic details and skills.",
  "A strong next step is to tailor your resume to the role, lead with measurable outcomes, and keep the most relevant skills easy to find.",
  "I can help you narrow that down. Look for drives where your eligibility is confirmed and your strongest skills overlap with the role requirements."
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user" as const, text },
      { id: Date.now() + 1, role: "assistant" as const, text: responses[current.length % responses.length] }
    ]);
    setInput("");
  }

  function askPrompt(prompt: string) {
    setInput(prompt);
  }

  return (
    <MinimalPage
      eyebrow="Career Assistant"
      title="Assistant"
    >
      <SectionCard title="Career Assistant">
        <div className="flex min-h-[360px] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pb-5">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 text-[13px] leading-6 ${
                    message.role === "user"
                      ? "rounded-[10px] rounded-br-[3px] bg-sky-500 text-white"
                      : "rounded-[10px] rounded-bl-[3px] border border-slate-800/70 bg-slate-950/55 text-slate-300"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex items-end gap-3 border-t border-slate-800/60 pt-4">
            <label className="sr-only" htmlFor="assistant-message">Message the career assistant</label>
            <textarea
              id="assistant-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Ask about your placement journey..."
              rows={1}
              className="min-h-11 flex-1 resize-none rounded-[8px] border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/70"
            />
            <button type="submit" className="h-11 rounded-[8px] bg-sky-500 px-5 text-[13px] font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50" disabled={!input.trim()}>
              Send
            </button>
          </form>
        </div>
      </SectionCard>

      <SectionCard title="Suggested Questions">
        <div className="grid gap-3">
          {prompts.map((prompt) => (
            <button key={prompt} type="button" onClick={() => askPrompt(prompt)} className="rounded-[8px] border border-slate-800/60 bg-slate-950/45 px-4 py-3 text-left text-[13px] text-slate-200 transition hover:border-sky-400/40 hover:bg-slate-950/70">
              {prompt}
            </button>
          ))}
        </div>
      </SectionCard>
    </MinimalPage>
  );
}
