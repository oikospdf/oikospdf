import { useCallback } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  uploaderType: "pdf" | "image" | "both";
}

export const FileUploader = ({ onFilesSelected, uploaderType }: FileUploaderProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter(
        (file) =>
          uploaderType === "image"
            ? file.type.startsWith("image/")
            : uploaderType === "pdf"
            ? file.type === "application/pdf"
            : file.type.startsWith("image/") || file.type === "application/pdf"
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
        accept={uploaderType === "image" ? "image/*" : uploaderType === "pdf" ? "application/pdf" : "image/*,application/pdf"}
        onChange={handleFileInput}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-muted-foreground">
          {
            uploaderType === "image"
              ? "Supports image files (PNG, JPG, JPEG)"
              : uploaderType === "pdf"
              ? "Supports PDF files only"
              : "Supports images (PNG, JPG, WEBP) and PDF files"
          }
        </p>
      </label>
    </div>
  );
};
