import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export default function Card({ children, className = '', glow = false, hover = false }: CardProps) {
  return (
    <div
      className={`
        rounded-xl border border-card-border bg-card
        ${glow ? 'ai-glow' : ''}
        ${hover ? 'card-hover' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b border-card-border ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}
