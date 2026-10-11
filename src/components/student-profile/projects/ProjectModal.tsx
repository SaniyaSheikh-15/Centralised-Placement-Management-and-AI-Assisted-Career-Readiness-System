'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { Project } from '@/types/student-profile';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id'> & { id?: string }) => void;
  editingProject?: Project | null;
}

export default function ProjectModal({ isOpen, onClose, onSubmit, editingProject = null }: ProjectModalProps) {
  const [formData, setFormData] = useState({ name: '', description: '', techStackInput: '', techStack: [] as string[], githubUrl: '', liveUrl: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingProject) {
      setFormData({ name: editingProject.name, description: editingProject.description, techStackInput: '', techStack: editingProject.techStack || [], githubUrl: editingProject.githubUrl, liveUrl: editingProject.liveUrl });
    } else {
      setFormData({ name: '', description: '', techStackInput: '', techStack: [], githubUrl: '', liveUrl: '' });
    }
    setErrors({});
  }, [editingProject, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = formData.techStackInput.trim();
      if (tag && !formData.techStack.includes(tag)) {
        setFormData((prev) => ({ ...prev, techStack: [...prev.techStack, tag], techStackInput: '' }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Project name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    let finalTechStack = [...formData.techStack];
    if (formData.techStackInput.trim()) finalTechStack.push(formData.techStackInput.trim());

    onSubmit({
      ...(editingProject ? { id: editingProject.id } : {}),
      name: formData.name.trim(), description: formData.description.trim(),
      techStack: finalTechStack, githubUrl: formData.githubUrl.trim(), liveUrl: formData.liveUrl.trim(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-[var(--border-card)] bg-[var(--bg-card)] sm:max-w-lg">
        <DialogHeader><DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Project Name *</Label>
            <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g. CampusConnect Platform" autoFocus className={errors.name ? 'border-[var(--color-danger)]' : ''} />
            {errors.name && <p className="text-xs text-[var(--color-danger)]">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Describe your project..." rows={3} className={errors.description ? 'border-[var(--color-danger)]' : ''} />
            {errors.description && <p className="text-xs text-[var(--color-danger)]">{errors.description}</p>}
          </div>
          <div className="space-y-2">
            <Label>Tech Stack</Label>
            {formData.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.techStack.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 bg-[var(--bg-secondary)]">
                    {tag}
                    <button type="button" onClick={() => setFormData((p) => ({ ...p, techStack: p.techStack.filter((t) => t !== tag) }))} className="ml-1 hover:text-[var(--color-danger)]"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
            <Input value={formData.techStackInput} onChange={(e) => handleChange('techStackInput', e.target.value)} onKeyDown={handleTechKeyDown} placeholder="Type and press Enter to add" />
            <p className="text-xs text-[var(--text-muted)]">Press Enter or comma to add tags</p>
          </div>
          <div className="space-y-2">
            <Label>GitHub Link</Label>
            <Input type="url" value={formData.githubUrl} onChange={(e) => handleChange('githubUrl', e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Live Demo Link</Label>
            <Input type="url" value={formData.liveUrl} onChange={(e) => handleChange('liveUrl', e.target.value)} placeholder="https://..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{editingProject ? 'Update Project' : 'Add Project'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
