import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudentProfileProvider } from './features/student-profile/context/StudentProfileContext';
import Sidebar from './components/shared/Sidebar';
import TopNavbar from './components/shared/TopNavbar';

// Pages
import StudentProfileOverviewPage from './features/student-profile/pages/StudentProfileOverviewPage';
import EditProfilePage from './features/student-profile/pages/EditProfilePage';
import ResumeUploadPage from './features/student-profile/pages/ResumeUploadPage';
import SkillsManagementPage from './features/student-profile/pages/SkillsManagementPage';
import ProjectsPage from './features/student-profile/pages/ProjectsPage';
import CertificationsPage from './features/student-profile/pages/CertificationsPage';

/**
 * App — Root component
 * Sets up routing, layout wrapper (Sidebar + Navbar), and Context Provider.
 */

export default function App() {
  return (
    <BrowserRouter>
      <StudentProfileProvider>
        <div className="app-layout">
          <Sidebar />
          <div className="main-content">
            <TopNavbar />
            <Routes>
              <Route path="/profile" element={<StudentProfileOverviewPage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/profile/resume" element={<ResumeUploadPage />} />
              <Route path="/profile/skills" element={<SkillsManagementPage />} />
              <Route path="/profile/projects" element={<ProjectsPage />} />
              <Route path="/profile/certifications" element={<CertificationsPage />} />
              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/profile" replace />} />
            </Routes>
          </div>
        </div>
      </StudentProfileProvider>
    </BrowserRouter>
  );
}
