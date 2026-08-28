'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, BookOpen, FolderGit2, Award, Mic, Map,
  ArrowRight, Sparkles, ChevronRight, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';
import { SkeletonCard, SkeletonLine } from '@/components/member6/shared/Skeleton';
import { apiClient, GuidanceApiResponse } from '@/lib/api';
import { mockGuidanceData } from '@/lib/mock-data';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function GuidancePage() {
  const [data, setData] = useState<GuidanceApiResponse>(mockGuidanceData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGuidance() {
      try {
        const res = await apiClient.getGuidance('student-1');
        setData(res);
      } catch (err) {
        console.error('Failed to load guidance from API, using cached data', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGuidance();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <SkeletonLine width="240px" height="2rem" />
          <SkeletonLine width="100px" height="1.5rem" />
        </div>
        <SkeletonCard className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard className="h-48" />
          <SkeletonCard className="h-48" />
          <SkeletonCard className="md:col-span-2 h-56" />
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Personalized Guidance</h1>
          <p className="text-sm text-text-secondary mt-1">
            AI-synthesized career plan based on your profile, skills, and goals
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full ai-gradient text-white text-xs font-semibold flex items-center gap-1.5">
          <Sparkles size={12} />
          AI Generated
        </div>
      </motion.div>

      {/* Recommended Role */}
      <motion.div variants={item}>
        <Card glow>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl ai-gradient flex items-center justify-center shrink-0">
                <Target size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-accent-blue uppercase tracking-wider mb-1">
                  Recommended Role
                </p>
                <h2 className="text-xl font-bold text-text-primary">{data.recommendedRole}</h2>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">{data.reasoning}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Skills to Learn */}
        <motion.div variants={item}>
          <Card hover className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                  <BookOpen size={18} className="text-accent-blue" />
                </div>
                <h3 className="font-semibold text-text-primary">Skills to Learn</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skillsToLearn.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-accent-blue/10 text-accent-blue text-xs font-medium border border-accent-blue/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications */}
        <motion.div variants={item}>
          <Card hover className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center">
                  <Award size={18} className="text-accent-purple" />
                </div>
                <h3 className="font-semibold text-text-primary">Certifications</h3>
              </div>
              <ul className="space-y-2.5">
                {data.certifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-purple shrink-0" />
                    {cert}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects to Build */}
        <motion.div variants={item} className="md:col-span-2">
          <Card hover>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-status-success/10 flex items-center justify-center">
                  <FolderGit2 size={18} className="text-status-success" />
                </div>
                <h3 className="font-semibold text-text-primary">Projects to Build</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.projectsToBuild.map((project, i) => (
                  <div
                    key={project.title}
                    className="p-4 rounded-xl bg-bg-primary border border-card-border"
                  >
                    <div className="w-8 h-8 rounded-lg bg-status-success/10 flex items-center justify-center mb-3">
                      <span className="text-sm font-bold text-status-success">{i + 1}</span>
                    </div>
                    <h4 className="font-medium text-text-primary text-sm">{project.title}</h4>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interview Prep CTA */}
      <motion.div variants={item}>
        <Link href="/mock-interview">
          <Card hover className="cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-status-warning/10 flex items-center justify-center">
                    <Mic size={22} className="text-status-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Interview Prep</h3>
                    <p className="text-sm text-text-secondary mt-0.5">
                      Practice mock interviews for {data.recommendedRole} role
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={20}
                  className="text-text-muted group-hover:text-accent-blue group-hover:translate-x-1 transition-all"
                />
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      {/* Career Roadmap */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg ai-gradient flex items-center justify-center">
                <Map size={18} className="text-white" />
              </div>
              <h3 className="font-semibold text-text-primary">Career Roadmap</h3>
            </div>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-card-border" />
              <div className="space-y-6">
                {data.roadmap.map((step, i) => (
                  <div key={step.order} className="flex items-start gap-4 relative">
                    <div
                      className={`
                        relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0
                        text-xs font-bold
                        ${i === 0
                          ? 'ai-gradient text-white ai-glow'
                          : 'bg-card border border-card-border text-text-muted'
                        }
                      `}
                    >
                      {step.order}
                    </div>
                    <div className="pt-1">
                      <p
                        className={`text-sm font-medium ${
                          i === 0 ? 'text-text-primary' : 'text-text-secondary'
                        }`}
                      >
                        {step.step}
                      </p>
                      {i === 0 && (
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-[11px] font-medium">
                          <ChevronRight size={10} />
                          Current Step
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
