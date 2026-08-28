'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatMode } from '@/types/career-assistant';
import ChatInterface from '@/components/member6/career-assistant/ChatInterface';
import ChatInput from '@/components/member6/career-assistant/ChatInput';
import SuggestedPrompts from '@/components/member6/career-assistant/SuggestedPrompts';
import ResumeContextBanner from '@/components/member6/career-assistant/ResumeContextBanner';
import { suggestedPrompts, resumePrompts, mockChatMessages } from '@/lib/mock-data';
import { apiClient } from '@/lib/api';
import { Sparkles, Trash2, AlertCircle } from 'lucide-react';

export default function CareerAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [mode, setMode] = useState<ChatMode>('general');
  const [hasResume, setHasResume] = useState(true);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch real resume status from API on load
  useEffect(() => {
    async function loadResumeStatus() {
      try {
        const res = await apiClient.getResumeStatus('student-1');
        setHasResume(res.hasResume);
      } catch (err) {
        console.error('Failed to fetch resume status from API', err);
      }
    }
    loadResumeStatus();
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      setErrorMessage(null);
      // Add user message to UI immediately
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        referencesResume: mode === 'resume',
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);

      try {
        if (mode === 'resume') {
          // Call Backend API: POST /api/assistant/resume-qa
          const response = await apiClient.sendResumeQA(content, 'student-1');
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: response.answer,
            timestamp: new Date().toISOString(),
            referencesResume: true,
          };
          setMessages((prev) => [...prev, aiMsg]);
        } else {
          // Call Backend API: POST /api/assistant/chat
          const response = await apiClient.sendChatMessage(content, 'student-1', conversationId);
          setConversationId(response.conversationId);
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: response.reply,
            timestamp: response.createdAt || new Date().toISOString(),
            referencesResume: false,
          };
          setMessages((prev) => [...prev, aiMsg]);
        }
      } catch (err: any) {
        console.error('API Error:', err);
        setErrorMessage('Failed to connect to AI Career service. Please check your connection and retry.');
      } finally {
        setIsStreaming(false);
      }
    },
    [mode, conversationId]
  );

  const handleClearChat = () => {
    setMessages([]);
    setErrorMessage(null);
    setConversationId(undefined);
  };

  const handleLoadDemo = () => {
    setMessages(mockChatMessages);
    setErrorMessage(null);
  };

  const currentPrompts = mode === 'resume' ? resumePrompts : suggestedPrompts;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-2xl border border-card-border bg-bg-secondary overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-card-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl ai-gradient flex items-center justify-center ai-glow">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">AI Career Assistant</h2>
            <p className="text-xs text-text-muted">
              {mode === 'resume' ? 'Resume Q&A Mode' : 'General Career Guidance'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadDemo}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-accent-blue hover:bg-accent-blue/10 transition-colors cursor-pointer"
          >
            Load Demo
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors cursor-pointer"
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Resume Context Banner */}
      <ResumeContextBanner
        hasResume={hasResume}
        mode={mode}
        onToggleMode={() => setMode((prev) => (prev === 'general' ? 'resume' : 'general'))}
      />

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-status-danger/10 border border-status-danger/20 flex items-center gap-2 text-xs text-status-danger">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Chat area */}
      {messages.length === 0 && !isStreaming ? (
        <div className="flex-1 flex items-center justify-center">
          <SuggestedPrompts prompts={currentPrompts} onSelect={handleSendMessage} />
        </div>
      ) : (
        <ChatInterface messages={messages} isStreaming={isStreaming} />
      )}

      {/* Input */}
      <ChatInput onSend={handleSendMessage} isStreaming={isStreaming} />
    </div>
  );
}
