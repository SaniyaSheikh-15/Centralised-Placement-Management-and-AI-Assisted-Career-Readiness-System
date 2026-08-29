'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import ProjectCard from '@/components/student-profile/projects/ProjectCard';
import ProjectModal from '@/components/student-profile/projects/ProjectModal';
import DeleteConfirmModal from '@/components/student-profile/common/DeleteConfirmModal';
import ProfileEmptyState from '@/components/student-profile/common/ProfileEmptyState';
import ProfileSkeletonLoader from '@/components/student-profile/common/ProfileSkeletonLoader';
import ProfileErrorState from '@/components/student-profile/common/ProfileErrorState';
import type { Project } from '@/types/student-profile';

export default function ProjectsPage() {
  const {
    profile, addProject, updateProject, deleteProject,
    isLoading, error, simulateLoading, clearError,
  } = useStudentProfile();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    simulateLoading(600).then(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (project: Omit<Project, 'id'> & { id?: string }) => {
    if (editingProject) {
      updateProject(editingProject.id, project);
    } else {
      addProject(project);
    }
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingProject) {
      deleteProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  if (isLoading && !loaded) return <ProfileSkeletonLoader variant="cards" />;
  if (error) return <ProfileErrorState message={error} onRetry={clearError} />;

  const projects = profile.projects;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#F1F5F9]">Projects</h2>
          <p className="text-sm text-[#64748B]">Showcase your real-world projects and contributions</p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1683FF] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0D6FE0]"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <ProfileEmptyState
          icon="🔨"
          title="No projects added yet"
          description="Add your technical projects to demonstrate your skills and experience."
          actionLabel="Add Project"
          onAction={() => { setEditingProject(null); setShowModal(true); }}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onEdit={handleEdit} onDelete={(p) => setDeletingProject(p)} />
          ))}
        </div>
      )}

      <ProjectModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingProject(null); }} onSubmit={handleSubmit} editingProject={editingProject} />
      <DeleteConfirmModal isOpen={!!deletingProject} title="Delete Project" message={`Are you sure you want to delete "${deletingProject?.name}"? This action cannot be undone.`} onConfirm={handleDeleteConfirm} onCancel={() => setDeletingProject(null)} />
    </div>
  );
}
