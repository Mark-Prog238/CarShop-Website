import { Button } from "./Button";

export const Pagination = ({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) => {
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button variant="secondary" size="sm" disabled={!canPrev} onClick={() => canPrev && onChange(page - 1)}>Prev</Button>
      <span className="text-white/80 text-sm">Page {page} of {totalPages}</span>
      <Button variant="secondary" size="sm" disabled={!canNext} onClick={() => canNext && onChange(page + 1)}>Next</Button>
    </div>
  );
};


