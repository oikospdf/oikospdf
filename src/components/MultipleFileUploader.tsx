import { useCallback } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface MultipleFileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  title: string;
  description: string;
  uploaderType: string[];
}

export const MultipleFileUploader = ({ onFilesSelected, title, description,uploaderType }: MultipleFileUploaderProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter(
        (file) => uploaderType.includes(file.type)
      );
      
      if (files.length === 0) {
        toast.error("Please upload valid files only");
        return;
      }
      
      onFilesSelected(files);
      toast.success(`${files.length} file(s) added`);
    },
    [onFilesSelected]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
      toast.success(`${files.length} file(s) added`);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-border rounded-lg p-12 text-center transition-colors hover:border-primary hover:bg-muted/50 cursor-pointer"
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        accept={uploaderType.join(",")}
        onChange={handleFileInput}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">
          {title}
        </p>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </label>
    </div>
  );
};
