'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuggestedPromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({ prompts, onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 rounded-2xl ai-gradient flex items-center justify-center mb-5 ai-glow"
      >
        <Sparkles size={28} className="text-white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-text-primary text-center"
      >
        How can I help you today?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-text-secondary mt-2 text-center max-w-md"
      >
        Ask me anything about careers, skills, resumes, or interview preparation.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-2 justify-center mt-6 max-w-2xl"
      >
        {prompts.map((prompt, i) => (
          <motion.button
            key={prompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            onClick={() => onSelect(prompt)}
            className="
              px-4 py-2.5 rounded-xl text-sm font-medium
              bg-card border border-card-border text-text-secondary
              hover:border-accent-blue/40 hover:text-accent-blue hover:bg-accent-blue/5
              transition-all duration-200 cursor-pointer
            "
          >
            {prompt}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
