import Layout from "@/components/Layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { dividePdfIntoSinglePages, createZipFromPdfs, downloadZip } from "@/lib/pdf-tools";
import { SingleFileUploader } from "@/components/SingleFileUploader";

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

        <SingleFileUploader
          onFileSelected={handleFileSelected}
          title="Drop PDF here or click to upload"
          description="Upload a PDF file to split"
        />
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
                aria-label="Remove file"
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
            aria-label="Divide PDF and download ZIP file"
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