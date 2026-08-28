import './ProjectCard.css';

/**
 * ProjectCard
 * Individual project display card with name, description,
 * tech stack tags, external links, and edit/delete actions.
 */

export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="project-card card">
      <div className="card-header">
        <h3 className="card-title">{project.name}</h3>
        <div className="project-card-actions">
          <button
            className="btn btn-icon btn-sm"
            onClick={() => onEdit(project)}
            title="Edit project"
          >
            ✏️
          </button>
          <button
            className="btn btn-icon btn-sm"
            onClick={() => onDelete(project)}
            title="Delete project"
            style={{ color: 'var(--color-danger)' }}
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="project-card-desc">{project.description}</p>

      {/* Tech Stack Tags */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="project-card-tags">
          {project.techStack.map((tech, idx) => (
            <span key={idx} className="chip chip-secondary">{tech}</span>
          ))}
        </div>
      )}

      {/* External Links */}
      <div className="project-card-links">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-ghost"
          >
            🔗 GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-secondary"
          >
            🌐 Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
