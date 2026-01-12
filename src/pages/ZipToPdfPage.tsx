import Layout from "@/components/Layout";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { createPdfFromImages, downloadPdf, extractImagesFromZip } from "@/lib/pdf-tools";
import { SingleFileUploader } from "@/components/SingleFileUploader";

const ZipToPdfPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [imageCount, setImageCount] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelected = useCallback(async (selectedFile: File) => {
        if (!selectedFile || !selectedFile.name.toLowerCase().endsWith(".zip")) {
            toast.error("Please upload a ZIP file");
            return;
        }

        try {
            const images = await extractImagesFromZip(selectedFile);
            if (images.length === 0) {
                toast.error("No valid images (PNG/JPG/WEBP) found in the ZIP file");
                return;
            }

            setFile(selectedFile);
            setImageCount(images.length);
            toast.success(`ZIP loaded: ${imageCount} images`);
        } catch (error) {
            console.error("Error loading ZIP:", error);
            toast.error("Failed to load ZIP");
        }
    }, []);

    const handleConvert = async () => {
        if (!file) {
            toast.error("Please upload a ZIP file first");
            return;
        }

        try {
            setIsProcessing(true);
            const images = await extractImagesFromZip(file);
            const pdfBytes = await createPdfFromImages(images.map((img: { file: File }) => img.file));
            const outputName = file.name.replace(/\.zip$/i, "") + ".pdf";
            downloadPdf(pdfBytes, outputName);
            toast.success("PDF created successfully!");
        } catch (error) {
            console.error("Error creating PDF:", error);
            toast.error("Failed to create PDF");
        } finally {
            setIsProcessing(false);
            handleClear();
        }
    };

    const handleClear = () => {
        setFile(null);
        setImageCount(0);
    };

    return (
        <Layout>
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">ZIP to PDF</h2>
                <p className="text-muted-foreground">
                    Upload a ZIP file containing images (PNG/JPG/WEBP) and convert them into a single PDF
                </p>
            </div>

            {!file ? (
                <SingleFileUploader
                    onFileSelected={handleFileSelected}
                    title="Drop a ZIP here or click to upload"
                    description="Upload a ZIP file containing images (PNG/JPG/WEBP) to convert them into a single PDF"
                    accept=".zip"
                />
            ) : (
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-muted rounded flex items-center justify-center">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                            </div>
                            <Button
                                variant="ghost"
                                className="cursor-pointer"
                                size="sm"
                                aria-label="Remove file"
                                onClick={handleClear}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{file.name.replace(/\.zip$/i, "") + ".pdf"}</p>
                                <p className="text-left text-sm text-muted-foreground my-1">
                                    A file with {imageCount} page{imageCount !== 1 ? "s" : ""} will be created (sorted alphabetically)
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            size="lg"
                            className="w-full cursor-pointer"
                        >
                            <Download className="mr-2 h-5 w-5" />
                            {isProcessing ? "Creating PDF..." : "Create PDF"}
                        </Button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ZipToPdfPage;