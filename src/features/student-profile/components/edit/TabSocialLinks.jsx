import { useStudentProfile } from '../../context/StudentProfileContext';

/**
 * TabSocialLinks — Edit Tab 8
 * URL inputs for GitHub, LinkedIn, Portfolio, and LeetCode/coding profiles
 * with URL format validation.
 */

export default function TabSocialLinks() {
  const { editDraft, updateOnlinePresence } = useStudentProfile();
  const o = editDraft.onlinePresence;

  const handleChange = (field, value) => {
    updateOnlinePresence({ [field]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
        Add your online profiles to help recruiters find and verify your work.
      </p>

      <div className="form-group">
        <label className="form-label">🐙 GitHub Profile</label>
        <input
          className="form-input"
          type="url"
          value={o.githubUrl}
          onChange={(e) => handleChange('githubUrl', e.target.value)}
          placeholder="https://github.com/yourusername"
        />
        <span className="form-helper">Your GitHub profile URL</span>
      </div>

      <div className="form-group">
        <label className="form-label">💼 LinkedIn Profile</label>
        <input
          className="form-input"
          type="url"
          value={o.linkedinUrl}
          onChange={(e) => handleChange('linkedinUrl', e.target.value)}
          placeholder="https://linkedin.com/in/yourusername"
        />
        <span className="form-helper">Your LinkedIn profile URL</span>
      </div>

      <div className="form-group">
        <label className="form-label">🌐 Portfolio Website</label>
        <input
          className="form-input"
          type="url"
          value={o.portfolioUrl}
          onChange={(e) => handleChange('portfolioUrl', e.target.value)}
          placeholder="https://yourportfolio.com"
        />
        <span className="form-helper">Your personal portfolio or website</span>
      </div>

      <div className="form-group">
        <label className="form-label">💻 Coding Profile</label>
        <input
          className="form-input"
          type="url"
          value={o.codingProfileUrl}
          onChange={(e) => handleChange('codingProfileUrl', e.target.value)}
          placeholder="https://leetcode.com/yourusername"
        />
        <span className="form-helper">LeetCode, CodeChef, HackerRank, or similar</span>
      </div>
    </div>
  );
}
