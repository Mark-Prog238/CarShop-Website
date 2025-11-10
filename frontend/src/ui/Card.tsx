import { ReactNode } from "react";

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-xl bg-buttonBg shadow-xl border border-black/10 ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`px-4 py-3 border-b border-black/10 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`px-4 py-4 ${className}`}>{children}</div>
);


