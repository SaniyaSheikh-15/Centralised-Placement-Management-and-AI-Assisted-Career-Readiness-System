import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import PlacementMatchPage from './pages/PlacementMatchPage';
import SkillGapPage from './pages/SkillGapPage';
import './styles.css';

const navItems = [['Dashboard', '▦'], ['Profile', '◉'], ['Placement Drives', '▣'], ['Applications', '▤'], ['Eligibility', '✓'], ['Resume Analyzer', '✦', '/resume-analyzer'], ['Placement Match', '◎', '/placement-match'], ['Skill Gap', '⌁', '/skill-gap'], ['Assistant', '◇'], ['Mock Interview', '◌'], ['Analytics', '↗']];
const pages = {
  '/resume-analyzer': { name: 'Resume Analyzer', component: ResumeAnalyzerPage },
  '/placement-match': { name: 'Placement Match', component: PlacementMatchPage },
  '/skill-gap': { name: 'Skill Gap', component: SkillGapPage }
};
const defaultRoute = '/resume-analyzer';

function App() {
  const [route, setRoute] = useState(() => pages[window.location.pathname] ? window.location.pathname : defaultRoute);
  const [open, setOpen] = useState(false);
  const currentPage = pages[route] || pages[defaultRoute];
  const CurrentPage = currentPage.component;

  useEffect(() => {
    const handlePopState = () => setRoute(pages[window.location.pathname] ? window.location.pathname : defaultRoute);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = nextRoute => {
    window.history.pushState({}, '', nextRoute);
    setRoute(nextRoute);
    setOpen(false);
  };

  return <div className="app"><aside className={'sidebar ' + (open ? 'open' : '')}><div className="brand"><span>✦</span> CampusConnect</div><div className="student"><div>AS</div><span><b>Aryan Sharma</b><small>Student account</small></span></div><nav>{navItems.map(([name, icon, itemRoute]) => itemRoute ? <a className={route === itemRoute ? 'active' : ''} href={itemRoute} onClick={event => { event.preventDefault(); navigate(itemRoute); }} key={name}><i>{icon}</i>{name}</a> : <button key={name}><i>{icon}</i>{name}</button>)}</nav><button className="logout">↪ Logout</button></aside><main><header className="topbar"><button className="menu" onClick={() => setOpen(!open)}>☰</button><div className="search">⌕ <input placeholder="Search anything…" /></div><div className="top-actions"><button>◌</button><button>◔</button><span className="avatar">AS</span></div></header><div className="page-content"><CurrentPage /></div></main></div>;
}

createRoot(document.getElementById('root')).render(<App />);
