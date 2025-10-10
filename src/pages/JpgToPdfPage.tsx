import Layout from "@/components/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MultipleFileUploader } from "@/components/MultipleFileUploader";
import { FileList } from "@/components/FileList";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { createPdfFromImages, downloadPdf } from "@/lib/pdf-tools";

interface FileItem {
    id: string;
    file: File;
    preview?: string;
}

const JpgToPdf = () => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilesSelected = (newFiles: File[]) => {
        const imageFiles = newFiles.filter((file) => file.type.startsWith("image/"));

        if (imageFiles.length === 0) {
            toast.error("Please upload image files only");
            return;
        }

        const fileItems: FileItem[] = imageFiles.map((file) => ({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
        }));

        setFiles((prev) => [...prev, ...fileItems]);
    };

    const handleReorder = (newFiles: FileItem[]) => {
        setFiles(newFiles);
    };

    const handleRemove = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const handleConvert = async () => {
        if (files.length === 0) {
            toast.error("Please add at least one image");
            return;
        }

        try {
            setIsProcessing(true);
            const pdfBytes = await createPdfFromImages(files.map((f) => f.file));
            downloadPdf(pdfBytes, "images-to-pdf.pdf");
            toast.success("PDF created successfully!");
        } catch (error) {
            console.error("Error creating PDF:", error);
            toast.error("Failed to create PDF");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Layout>

            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Convert JPGs to PDF</h2>
                <p className="text-muted-foreground">
                    Convert and merge multiple JPG images into a single PDF document
                </p>
            </div>

            <div className="space-y-6">
                <MultipleFileUploader
                    onFilesSelected={handleFilesSelected}
                    title="Drop files here or click to upload"
                    description="Supports only JPG/JPEG files"
                    uploaderType={["image/jpg", "image/jpeg"]}
                />

                {files.length > 0 && (
                    <>
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Selected Images ({files.length})
                            </h2>
                            <FileList
                                files={files}
                                onReorder={handleReorder}
                                onRemove={handleRemove}
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={handleConvert}
                                disabled={isProcessing}
                                size="lg"
                                className="min-w-[200px] cursor-pointer"
                                aria-label="Convert to PDF"
                            >
                                <Download className="mr-2 h-5 w-5" />
                                {isProcessing ? "Creating PDF..." : "Create PDF"}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default JpgToPdf;
