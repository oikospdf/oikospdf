import Layout from "@/components/Layout";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { deletePagesFromPdf, downloadPdf } from "@/lib/pdf-tools";
import { PDFDocument } from "pdf-lib";

const DeletePage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [pagesToDelete, setPagesToDelete] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelected = useCallback(async (selectedFile: File) => {
        if (selectedFile.type !== "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        }

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPageCount();

            setFile(selectedFile);
            setPageCount(pages);
            toast.success(`PDF loaded: ${pages} pages`);
        } catch (error) {
            console.error("Error loading PDF:", error);
            toast.error("Failed to load PDF");
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                handleFileSelected(droppedFile);
            }
        },
        [handleFileSelected]
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelected(e.target.files[0]);
        }
    };

    const handleDelete = async () => {
        if (!file || !pagesToDelete.trim()) {
            toast.error("Please specify pages to delete");
            return;
        }

        setIsProcessing(true);
        try {
            const pdfBytes = await deletePagesFromPdf(file, pagesToDelete);
            downloadPdf(pdfBytes, `deleted-pages.pdf`);
            toast.success("PDF processed successfully!");
        } catch (error) {
            console.error("Error processing PDF:", error);
            toast.error(error instanceof Error ? error.message : "Failed to process PDF");
        } finally {
            setIsProcessing(false);
        }
    };

    return (


        <Layout>
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Delete Pages from PDF</h2>
                <p className="text-muted-foreground">
                    Remove specific pages from your PDF document
                </p>
            </div>

            {!file ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-border rounded-lg p-12 text-center transition-colors hover:border-primary hover:bg-muted/50 cursor-pointer"
                >
                    <input
                        type="file"
                        id="pdf-upload"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileInput}
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">
                            Drop PDF here or click to upload
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Upload a PDF file to remove pages
                        </p>
                    </label>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-muted rounded flex items-center justify-center">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {pageCount} pages • {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                className="cursor-pointer"
                                size="sm"
                                onClick={() => {
                                    setFile(null);
                                    setPageCount(0);
                                    setPagesToDelete("");
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4 bg-muted/50 rounded-lg p-6">
                        <div className="space-y-2">
                            <Label htmlFor="pages-to-delete" className="text-base font-semibold">
                                Pages to delete
                            </Label>
                            <Textarea
                                id="pages-to-delete"
                                placeholder="e.g., 1, 3, 5-7, 9"
                                value={pagesToDelete}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPagesToDelete(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <div className="space-y-1 text-xs text-muted-foreground">
                                <p>• Single pages: 1, 3, 9</p>
                                <p>• Ranges: 5-7 (deletes pages 5, 6, 7)</p>
                                <p>• Open ranges: 5- (deletes from page 5 to end)</p>
                                <p>• Combine: 1, 3, 5-7, 9</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleDelete}
                            disabled={isProcessing || !pagesToDelete.trim()}
                            className="w-full cursor-pointer"
                            size="lg"
                        >
                            <Trash2 className="h-5 w-5 mr-2" />
                            {isProcessing ? "Processing..." : "Delete Pages"}
                        </Button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default DeletePage;
