import { useCallback, useRef, useState, useEffect } from "react";

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
}

export const ImageUploader = ({ files, onChange, maxFiles = 8, maxSizeMb = 8 }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  useEffect(() => {
    // generate preview urls
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const validateFiles = (incoming: File[]): File[] => {
    const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
    const filtered = incoming.filter((f) => acceptedTypes.includes(f.type) && f.size <= maxSizeBytes);
    const total = [...files, ...filtered].slice(0, maxFiles);
    return total;
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    onChange(validateFiles(list));
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const list = Array.from(e.dataTransfer.files || []);
    onChange(validateFiles(list));
  }, [files]);

  const removeAt = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`uploader-drop ${dragOver ? "uploader-drop--active" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <p className="text-white text-sm">Drag & drop images here, or click to browse</p>
        <p className="text-white/60 text-xs">PNG, JPG, WEBP — up to {maxFiles} images, {maxSizeMb}MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={onPick}
          className="hidden"
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previews.map((src, i) => (
            <div key={`${src}-${i}`} className="relative group">
              <img src={src} className="w-full h-28 object-cover rounded-md border border-black/20" />
              <button
                type="button"
                className="absolute top-1 right-1 px-2 py-1 text-xs rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeAt(i)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


