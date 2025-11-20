import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export const ImageUploader = ({ files, onChange }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onChange([...files, ...newFiles]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onClick={handleClick}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.length) {
            const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
            onChange([...files, ...newFiles]);
          }
        }}
        className={`
          relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
          ${isDragging ? "border-primary bg-primary/10" : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/50"}
        `}
      >
        <div className="p-4 bg-background rounded-full mb-3 border border-white/10">
          <Upload size={24} className="text-primary" />
        </div>
        <p className="text-sm font-bold text-white">
          Click to upload photos
        </p>
        <p className="text-xs text-text-muted mt-1">
          or drag and drop here
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group bg-black">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};