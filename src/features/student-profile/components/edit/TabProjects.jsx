import { useState } from 'react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import ProjectCard from '../projects/ProjectCard';
import ProjectModal from '../projects/ProjectModal';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import ProfileEmptyState from '../common/ProfileEmptyState';

/**
 * TabProjects — Edit Tab 4
 * Embedded Project Management UI reusing project components.
 */

export default function TabProjects() {
  const { profile, addProject, updateProject, deleteProject } = useStudentProfile();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  const projects = profile.projects;

  const handleSubmit = (project) => {
    if (editingProject) {
      updateProject(editingProject.id, project);
    } else {
      addProject(project);
    }
    setEditingProject(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {projects.length} project{projects.length !== 1 ? 's' : ''} added
        </p>
        <button className="btn btn-sm btn-primary" onClick={() => { setEditingProject(null); setShowModal(true); }}>
          + Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <ProfileEmptyState icon="🔨" title="No projects added yet" description="Add your projects to showcase your work." actionLabel="Add Project" onAction={() => setShowModal(true)} />
      ) : (
        <div className="grid-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onEdit={(proj) => { setEditingProject(proj); setShowModal(true); }} onDelete={(proj) => setDeletingProject(proj)} />
          ))}
        </div>
      )}

      <ProjectModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingProject(null); }} onSubmit={handleSubmit} editingProject={editingProject} />
      <DeleteConfirmModal isOpen={!!deletingProject} title="Delete Project" message={`Delete "${deletingProject?.name}"?`} onConfirm={() => { deleteProject(deletingProject.id); setDeletingProject(null); }} onCancel={() => setDeletingProject(null)} />
    </div>
  );
}
