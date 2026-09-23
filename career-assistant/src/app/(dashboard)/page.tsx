'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Mic, Compass, TrendingUp, ArrowRight, Sparkles, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';

const features = [
  {
    title: 'AI Career Assistant',
    description: 'Get personalized career guidance with our AI-powered conversational assistant.',
    icon: MessageSquare,
    href: '/career-assistant',
    gradient: true,
    stats: '24/7 Available',
  },
  {
    title: 'Mock Interview',
    description: 'Practice with AI-generated interview questions tailored to your target role.',
    icon: Mic,
    href: '/mock-interview',
    gradient: true,
    stats: '5 Roles Available',
  },
  {
    title: 'Personalized Guidance',
    description: 'View your career roadmap, skills to learn, and certifications to pursue.',
    icon: Compass,
    href: '/career-assistant/guidance',
    gradient: false,
    stats: 'Updated Daily',
  },
  {
    title: 'Interview History',
    description: 'Track your progress across all your mock interview attempts.',
    icon: TrendingUp,
    href: '/mock-interview/history',
    gradient: false,
    stats: '5 Sessions',
  },
];

const quickActions = [
  { label: 'Ask about resume', icon: BookOpen, href: '/career-assistant' },
  { label: 'Start quick interview', icon: Target, href: '/mock-interview' },
  { label: 'View career roadmap', icon: Compass, href: '/career-assistant/guidance' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-2xl border border-card-border bg-card p-8">
          <div className="absolute top-0 right-0 w-80 h-80 ai-gradient opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl ai-gradient flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full ai-gradient text-white">
                AI-Powered
              </span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mt-4">
              Welcome back, <span className="ai-gradient-text">Student</span> 👋
            </h1>
            <p className="text-text-secondary mt-2 max-w-xl">
              Your personalized career hub. Get AI-powered guidance, practice interviews, and track your placement journey.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
          Quick Actions
        </h2>
        <div className="flex gap-3 flex-wrap">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <Card hover className="px-4 py-3 flex items-center gap-3 cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                    <Icon size={16} className="text-accent-blue" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">{action.label}</span>
                  <ArrowRight size={14} className="text-text-muted ml-1" />
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div variants={item}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
          Your Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.href}>
                <Card hover className="h-full cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          feature.gradient
                            ? 'ai-gradient'
                            : 'bg-accent-blue/10'
                        }`}
                      >
                        <Icon size={22} className="text-white" />
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-card-border/30 text-text-muted">
                        {feature.stats}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mt-4 group-hover:text-accent-blue transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-1 mt-4 text-accent-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Open</span>
                      <ArrowRight size={14} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
