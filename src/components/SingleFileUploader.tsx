import { Upload } from "lucide-react";

interface SingleFileUploaderProps {
    onFileSelected: (files: File) => void;
    title: string;
    description: string;
    accept?: string;
}

export const SingleFileUploader = ({ onFileSelected, title, description, accept = "application/pdf" }: SingleFileUploaderProps) => {

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            onFileSelected(droppedFile);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            onFileSelected(selectedFile);
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
                accept={accept}
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
