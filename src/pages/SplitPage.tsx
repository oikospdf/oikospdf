import Layout from "@/components/Layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";
import { Download, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { dividePdfIntoSinglePages, createZipFromPdfs, downloadZip } from "@/lib/pdf-tools";

const SplitPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setPageCount(pages);

      toast.success(`PDF loaded: ${pages} pages`);
    } catch (error) {
      toast.error("Failed to read the PDF file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelected(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelected(selectedFile);
    }
  };

  const handleDivide = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const singlePagePdfs = await dividePdfIntoSinglePages(file);
      const baseFilename = file.name.replace('.pdf', '');
      const zipBlob = await createZipFromPdfs(singlePagePdfs, baseFilename);
      downloadZip(zipBlob, `${baseFilename}_divided.zip`);
      toast.success(`PDF divided successfully into ${singlePagePdfs.length} PDFs!`);
    } catch (error) {
      toast.error("Failed to divide the PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Split PDF into Single Pages</h2>
        <p className="text-muted-foreground">
          Convert one PDF into multiple single-page PDF files
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
            Upload a PDF file to split
          </p>
        </label>
      </div>
      ) : (
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {pageCount} page{pageCount !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  setFile(null);
                  setPageCount(0);
                }}
              >
                Remove
              </Button>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This will create {pageCount} separate PDF files, one for each page, and package them into a ZIP file for download.
              </p>
            </div>
          </div>

          <Button
            className="w-full cursor-pointer"
            onClick={handleDivide}
            disabled={isProcessing}
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Divide PDF & Download ZIP
              </>
            )}
          </Button>
        </Card>
      )}
    </Layout>
  );
};

export default SplitPage;
