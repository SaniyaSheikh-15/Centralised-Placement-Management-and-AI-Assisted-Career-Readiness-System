import type { ReactNode } from "react";

interface MinimalPageProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  aside?: ReactNode;
}

export function MinimalPage({ eyebrow, title, description, children, aside }: MinimalPageProps) {
  return (
    <div className="space-y-5">
      <section className="panel px-5 py-5">
        {eyebrow ? <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-300/80">{eyebrow}</p> : null}
        <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight text-white sm:text-[30px]">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-[13px] leading-6 text-slate-400">{description}</p> : null}
      </section>

      {aside ? <section className="panel-soft px-5 py-4">{aside}</section> : null}

      <div className="space-y-5">{children}</div>
    </div>
  );
}

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, children, className = "" }: SectionCardProps) {
  return (
    <section className={`panel px-5 py-5 ${className}`.trim()}>
      {title ? <h3 className="text-base font-semibold text-white">{title}</h3> : null}
      {subtitle ? <p className="mt-1 text-[13px] leading-6 text-slate-400">{subtitle}</p> : null}
      <div className={title || subtitle ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
