export function Ring({ value, label, sublabel, large = false }) {
  return <div className="ring-wrap"><div className={'ring ' + (large ? 'large' : '')} style={{ '--score': `${value * 3.6}deg` }}><div><strong>{value}</strong><span>/ 100</span></div></div><div className="ring-copy"><span>{label}</span>{sublabel && <small>{sublabel}</small>}</div></div>;
}
export function Progress({ value, tone = 'blue' }) { return <div className="progress"><i className={tone} style={{ width: `${value}%` }} /></div>; }
export function Metric({ icon, label, value, note, tone = 'blue' }) { return <article className="metric card"><div className={'metric-icon ' + tone}>{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>; }
export function Tag({ children, kind = '' }) { return <span className={'tag ' + kind}>{children}</span>; }
export function PageTitle({ eyebrow, title, text }) { return <header className="page-title"><span>{eyebrow}</span><h1>{title}</h1><p>{text}</p></header>; }
export function SectionHead({ title, subtitle, action }) { return <div className="section-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action && <button className="text-button">{action} →</button>}</div>; }
export function LoadingState({ text }) { return <div className="loading card"><div className="loader">✦</div><h2>{text}</h2><p>This usually takes less than a minute.</p><div className="skeleton-row"><i/><i/><i/></div></div>; }
