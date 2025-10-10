import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileText, Image as ImageIcon, GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileCardProps {
  id: string;
  file: File;
  preview?: string;
  onRemove: (id: string) => void;
}

export const FileCard = ({ id, file, preview, onRemove }: FileCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 0.9 : 1
  };

  const isPdf = file.type === "application/pdf";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 group hover:border-primary transition-colors"
    >
      <button
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-shrink-0 w-16 h-16 bg-muted rounded flex items-center justify-center overflow-hidden">
        {preview && !isPdf ? (
          <img src={preview} alt={file.name} className="w-full h-full object-cover" />
        ) : isPdf ? (
          <FileText className="h-8 w-8 text-muted-foreground" />
        ) : (
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove file"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
