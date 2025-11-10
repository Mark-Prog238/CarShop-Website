export const Loader = ({ label = "Loading…" }: { label?: string }) => (
  <div className="flex items-center gap-3 text-white/80">
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
    <span className="text-sm">{label}</span>
  </div>
);


