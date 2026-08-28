'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Code2, Globe } from 'lucide-react';
import type { Project } from '@/types/student-profile';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className="group flex flex-col border-[var(--border-card)] bg-[var(--bg-card)] transition-all hover:border-[rgba(22,131,255,0.25)] hover:shadow-[var(--shadow-card-hover)]">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base text-[var(--text-primary)]">{project.name}</CardTitle>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(project)} title="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--color-danger)] hover:text-[var(--color-danger)]" onClick={() => onDelete(project)} title="Delete">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">{project.description}</p>
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech, idx) => (
              <Badge key={idx} variant="secondary" className="bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-auto flex gap-2 border-t border-[rgba(30,48,69,0.5)] pt-3">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Code2 className="mr-1.5 h-3.5 w-3.5" /> GitHub
              </Button>
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" className="h-7 text-xs">
                <Globe className="mr-1.5 h-3.5 w-3.5" /> Live Demo
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
