import Layout from "@/components/Layout";
import { useState, useCallback } from "react";
import { MultipleFileUploader } from "@/components/MultipleFileUploader";
import { FileList } from "@/components/FileList";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { convertImagesToPdfAndMerge, downloadPdf } from "@/lib/pdf-tools";

interface FileItem {
    id: string;
    file: File;
    preview?: string;
}

const MergePage = () => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilesSelected = useCallback((newFiles: File[]) => {
        const fileItems = newFiles.map((file) => {
            const id = `${file.name}-${Date.now()}-${Math.random()}`;
            const preview = file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : undefined;
            return { id, file, preview };
        });
        setFiles((prev) => [...prev, ...fileItems]);
    }, []);

    const handleReorder = useCallback((reorderedFiles: FileItem[]) => {
        setFiles(reorderedFiles);
    }, []);

    const handleRemove = useCallback((id: string) => {
        setFiles((prev) => {
            const fileToRemove = prev.find((f) => f.id === id);
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prev.filter((f) => f.id !== id);
        });
        toast.success("File removed");
    }, []);

    const handleClearAll = useCallback(() => {
        files.forEach((f) => {
            if (f.preview) URL.revokeObjectURL(f.preview);
        });
        setFiles([]);
        toast.success("All files cleared");
    }, [files]);

    const handleGeneratePdf = async () => {
        if (files.length === 0) {
            toast.error("Please add at least one file");
            return;
        }

        setIsProcessing(true);
        try {
            const pdfBytes = await convertImagesToPdfAndMerge(files.map((f) => f.file));
            downloadPdf(pdfBytes, "merged-document.pdf");
            toast.success("PDF generated successfully!");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Layout>
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Super Merge (experimental)</h2>
                <p className="text-muted-foreground">
                    Combine different types of images and PDF files into a single document. Currently supporting PNG, JPG, JPEG & PDF. We are working to support more image files such as webp or gif, but for now those images will <span className="font-bold">not be merged.</span>
                </p>
                <p className="text-muted-foreground">
                    <span className="font-bold">Warning</span>: This tool is not limited to a specific amount of files. However, loading too many files may cause performance issues, since this app uses only your computer&apos;s resources. If you experience any issues, please try to reduce the number of files.
                </p>
                <MultipleFileUploader
                    onFilesSelected={handleFilesSelected}
                    title="Drop files here or click to upload"
                    description="Supports images (PNG, JPG, JPEG) and PDF files "
                    uploaderType={["image/png", "image/jpeg", "image/jpg", "application/pdf"]}
                />
            </div>

            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                            {files.length} file{files.length !== 1 ? "s" : ""}
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            className="text-muted-foreground"
                            aria-label="Clear all files"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear all
                        </Button>
                    </div>

                    <FileList
                        files={files}
                        onReorder={handleReorder}
                        onRemove={handleRemove}
                    />

                    <Button
                        onClick={handleGeneratePdf}
                        disabled={isProcessing}
                        className="w-full"
                        size="lg"
                        aria-label="Generate PDF"
                    >
                        <Download className="h-5 w-5 mr-2" />
                        {isProcessing ? "Generating PDF..." : "Generate PDF"}
                    </Button>
                </div>
            )}
        </Layout >
    );
};

export default MergePage;
