'use client';

import { Pencil, Trash2, Code2, Globe } from 'lucide-react';
import type { Project } from '@/types/student-profile';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div className="group flex flex-col rounded-xl border border-[#1A2B42] bg-[#0E1B2E] transition-all hover:border-[rgba(22,131,255,0.25)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5">
        <h4 className="text-base font-bold text-[#F1F5F9]">{project.name}</h4>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(project)}
            className="rounded-md p-1.5 text-[#94A3B8] transition-colors hover:bg-white/10 hover:text-[#F1F5F9]"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="rounded-md p-1.5 text-[#EF4444] transition-colors hover:bg-red-500/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 line-clamp-3 px-5 text-xs leading-relaxed text-slate-300">
        {project.description}
      </p>

      {/* Tech Stack Pills */}
      {project.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 px-5">
          {project.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="rounded-md border border-[#1A2B42] bg-[#0A1524] px-2.5 py-1 text-[11px] font-medium text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Action Links */}
      <div className="mt-auto flex gap-2 border-t border-[#1A2B42]/50 px-5 py-3 mt-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-[#F1F5F9]"
          >
            <Code2 className="h-3.5 w-3.5" />
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-[#1683FF] transition-colors hover:bg-[#1683FF]/10"
          >
            <Globe className="h-3.5 w-3.5" />
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
