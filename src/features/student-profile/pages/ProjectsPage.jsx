import { useState, useEffect } from 'react';
import { useStudentProfile } from '../context/StudentProfileContext';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import ProfileEmptyState from '../components/common/ProfileEmptyState';
import ProfileSkeletonLoader from '../components/common/ProfileSkeletonLoader';
import ProfileErrorState from '../components/common/ProfileErrorState';

/**
 * ProjectsPage — /profile/projects
 * Project card grid with external link triggers, add/edit modal, delete confirmation.
 */

export default function ProjectsPage() {
  const {
    profile, addProject, updateProject, deleteProject,
    isLoading, error, simulateLoading, clearError,
  } = useStudentProfile();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    simulateLoading(600).then(() => setLoaded(true));
  }, []);

  const handleSubmit = (project) => {
    if (editingProject) {
      updateProject(editingProject.id, project);
    } else {
      addProject(project);
    }
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingProject) {
      deleteProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  if (isLoading && !loaded) return (
    <div className="page-container">
      <ProfileSkeletonLoader variant="cards" />
    </div>
  );

  if (error) return (
    <div className="page-container">
      <ProfileErrorState message={error} onRetry={clearError} />
    </div>
  );

  const projects = profile.projects;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Projects</h2>
          <p className="page-subtitle">Showcase your technical projects and contributions</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingProject(null); setShowModal(true); }}>
          + Add Project
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
        <div className="grid-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={(p) => setDeletingProject(p)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Project Modal */}
      <ProjectModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingProject(null); }}
        onSubmit={handleSubmit}
        editingProject={editingProject}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProject(null)}
      />
    </div>
  );
}
