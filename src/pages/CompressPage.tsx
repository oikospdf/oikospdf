import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { compressPdf, downloadPdf } from "@/lib/pdf-tools";
import Layout from "@/components/Layout";
import { PDFDocument } from "pdf-lib";
import { SinglePDFUploader } from "@/components/SingleFileUploader";

const Compress = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [originalSize, setOriginalSize] = useState<number>(0);
    const [compressedSize, setCompressedSize] = useState<number>(0);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    const handleFileSelected = async (selectedFile: File) => {
        if (selectedFile.type !== "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        }

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPageCount();

            setFile(selectedFile);
            setOriginalSize(selectedFile.size);
            setCompressedSize(0);

            toast.success(`PDF loaded: ${pages} pages`);
        } catch (error) {
            toast.error("Failed to read the PDF file");
        }
    };

    const handleCompress = async () => {
        if (!file) {
            toast.error("Please select a PDF file first");
            return;
        }

        setIsProcessing(true);
        try {
            const compressedBytes = await compressPdf(file);
            setCompressedSize(compressedBytes.length);

            const originalName = file.name.replace(".pdf", "");
            downloadPdf(compressedBytes, `${originalName}-compressed.pdf`);

            const reductionPercent = Math.round(
                ((originalSize - compressedBytes.length) / originalSize) * 100
            );

            toast.success(
                `PDF compressed successfully! Reduced by ${reductionPercent > 0 ? reductionPercent : 0}%`
            );
        } catch (error) {
            console.error("Error compressing PDF:", error);
            toast.error("Failed to compress PDF");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setOriginalSize(0);
        setCompressedSize(0);
    };

    return (
        <Layout>
            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">Compress PDF File</h2>
                    <p className="text-muted-foreground">
                        Reduce the size of your PDF document while maintaining quality
                    </p>
                    <p className="text-muted-foreground">
                        <span className="font-bold">Warning</span>: This is an experimental tool. Some documents will reduce its size significantly, but in some other the reduction might be minimal or it will not be possible to compress the document at all. Compressing the same file again will not reduce its size anymore.
                    </p>
                </div>

                {!file ? (
                    <SinglePDFUploader
                        onFileSelected={handleFileSelected}
                        title="Drop PDF here or click to upload"
                        description="Upload a PDF file to compress it"
                    />

                ) : (
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Original Size:</span>
                                <span className="text-sm text-muted-foreground">
                                    {formatFileSize(originalSize)}
                                </span>
                            </div>
                            {compressedSize > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Compressed Size:</span>
                                    <span className="text-sm text-muted-foreground">
                                        {formatFileSize(compressedSize)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleCompress}
                                disabled={isProcessing}
                                className="flex-1 cursor-pointer"
                                size="lg"
                            >
                                <Download className="h-5 w-5 mr-2" />
                                {isProcessing ? "Compressing..." : "Compress PDF"}
                            </Button>
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                size="lg"
                                className="cursor-pointer"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Layout >
    );
};

export default Compress;