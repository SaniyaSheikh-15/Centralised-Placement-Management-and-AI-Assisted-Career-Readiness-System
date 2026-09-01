'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import ProjectCard from '@/components/student-profile/projects/ProjectCard';
import ProjectModal from '@/components/student-profile/projects/ProjectModal';
import DeleteConfirmModal from '@/components/student-profile/common/DeleteConfirmModal';
import type { Project } from '@/types/student-profile';

export default function TabProjects() {
  const { editDraft, addProject, updateProject, deleteProject } = useStudentProfile();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const handleSubmit = (project: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, project);
    } else {
      addProject(project);
    }
    setEditingProject(null);
    setShowModal(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Projects ({editDraft.projects.length})</p>
        <Button size="sm" onClick={() => { setEditingProject(null); setShowModal(true); }}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Project</Button>
      </div>

      {editDraft.projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {editDraft.projects.map((project) => (
            <ProjectCard key={project.id} project={project} onEdit={handleEdit} onDelete={(p) => setDeletingProject(p)} />
          ))}
        </div>
      ) : (
        <p className="text-sm italic text-[var(--text-muted)]">No projects added yet. Click &quot;Add Project&quot; to showcase your work.</p>
      )}

      <ProjectModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingProject(null); }} onSubmit={handleSubmit} editingProject={editingProject} />
      <DeleteConfirmModal isOpen={!!deletingProject} title="Delete Project" message={`Are you sure you want to delete "${deletingProject?.name}"?`} onConfirm={() => { if (deletingProject) deleteProject(deletingProject.id); setDeletingProject(null); }} onCancel={() => setDeletingProject(null)} />
    </div>
  );
}
