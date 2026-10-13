'use client';

import { useState } from 'react';
import { Bot, Send, Sparkles, User, Lightbulb } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

export default function AssistantPage() {
  const { profile } = useStudentProfile();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hello ${profile.personalInfo.fullName.split(' ')[0] || 'there'}! I am your AI Placement Assistant. Ask me anything about preparing for upcoming drives, reviewing your resume, or mock interview questions for your branch (${profile.personalInfo.branch || 'Engineering'}).`,
    },
  ]);

  const quickPrompts = [
    'How do I tailor my resume for Microsoft SDE?',
    'What are the most common DSA questions in campus rounds?',
    'Explain how to approach the HR round relocation questions.',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let reply = "Here's what I recommend: Focus on strengthening your core data structures (Binary Trees, Graphs, Dynamic Programming) and ensure your projects emphasize impact with concrete metrics.";
      if (text.toLowerCase().includes('microsoft')) {
        reply = "For Microsoft SDE: Focus on clean code in your interviews, clarify edge cases before coding, and be ready to explain your tech stack choices in your React/Node.js projects.";
      } else if (text.toLowerCase().includes('hr')) {
        reply = "For HR rounds: Always express enthusiasm and adaptability. If you're willing to relocate, highlight that you're eager to work at major tech hubs (Bengaluru, Hyderabad, Pune).";
      }
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    }, 600);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-5xl flex-col rounded-2xl border border-[#16263D] bg-[#0A1424] shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#131F33] bg-[#0C1A2E] px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E4C8A] bg-[#0E274D] text-[#60A5FA]">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">CampusConnect AI Assistant</h2>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online & ready for placement guidance</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6 scrollbar-none">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0E274D] text-[#60A5FA]">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-[#1683FF] to-[#7C5CFC] text-white'
                  : 'border border-[#16263D] bg-[#0D1829] text-[#E2E8F0]'
              }`}
            >
              {m.text}
            </div>
            {m.role === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] text-xs font-bold text-white">
                ME
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="border-t border-[#131F33] bg-[#070E1A] px-6 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B]">
            <Lightbulb className="h-3 w-3 text-amber-400" />
            Suggestions:
          </span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="rounded-lg border border-[#16263D] bg-[#0A1424] px-2.5 py-1 text-xs text-[#94A3B8] transition-colors hover:border-[#1E4C8A] hover:text-white"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-3 border-t border-[#131F33] bg-[#0C1A2E] p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about placement rounds, interview tips, or company questions..."
          className="flex-1 rounded-xl border border-[#16263D] bg-[#070E1A] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#64748B] focus:border-[#1E4C8A]"
        />
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#1683FF] to-[#7C5CFC] text-white shadow-md hover:opacity-90"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
