import Layout from "@/components/Layout";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { splitPdf, downloadPdf } from "@/lib/pdf-tools";
import { PDFDocument } from "pdf-lib";

type SplitMode = "start" | "end" | "range" | null;

const SplitPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<SplitMode>(null);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
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
      setEndPage(pages);
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

  const handleSplit = async () => {
    if (!file || !splitMode) return;

    let start = 1;
    let end = pageCount;

    if (splitMode === "start") {
      start = 1;
      end = Math.min(endPage, pageCount);
    } else if (splitMode === "end") {
      start = Math.max(1, startPage);
      end = pageCount;
    } else if (splitMode === "range") {
      start = Math.max(1, startPage);
      end = Math.min(endPage, pageCount);
    }

    if (start > end) {
      toast.error("Start page must be less than or equal to end page");
      return;
    }

    setIsProcessing(true);
    try {
      const pdfBytes = await splitPdf(file, start, end);
      downloadPdf(pdfBytes, `split-pages-${start}-to-${end}.pdf`);
      toast.success(`PDF split successfully! Pages ${start}-${end}`);
    } catch (error) {
      console.error("Error splitting PDF:", error);
      toast.error("Failed to split PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Split PDF Pages</h2>
            <p className="text-muted-foreground">
              Extract specific pages from your PDF document
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
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setPageCount(0);
                      setSplitMode(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Select split mode</Label>
                <div className="grid gap-3">
                  <Button
                    variant={splitMode === "start" ? "default" : "outline"}
                    className="justify-start h-auto py-4 px-4 cursor-pointer"
                    onClick={() => setSplitMode("start")}
                  >
                    <div className="text-left">
                      <div className="font-medium">From beginning to page X</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Extract pages 1 to a specific page
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    variant={splitMode === "end" ? "default" : "outline"}
                    className="justify-start h-auto py-4 px-4 cursor-pointer"
                    onClick={() => setSplitMode("end")}
                  >
                    <div className="text-left">
                      <div className="font-medium">From page X to end</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Extract pages from a specific page to the end
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    variant={splitMode === "range" ? "default" : "outline"}
                    className="justify-start h-auto py-4 px-4 cursor-pointer"
                    onClick={() => setSplitMode("range")}
                  >
                    <div className="text-left">
                      <div className="font-medium">Between pages X and Y</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Extract a specific range of pages
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {splitMode && (
                <div className="space-y-4 bg-muted/50 rounded-lg p-4">
                  {splitMode === "start" && (
                    <div className="space-y-2">
                      <Label htmlFor="end-page">End at page</Label>
                      <Input
                        id="end-page"
                        type="number"
                        min={1}
                        max={pageCount}
                        value={endPage}
                        onChange={(e) => setEndPage(parseInt(e.target.value) || 1)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Will extract pages 1 to {Math.min(endPage, pageCount)}
                      </p>
                    </div>
                  )}

                  {splitMode === "end" && (
                    <div className="space-y-2">
                      <Label htmlFor="start-page">Start from page</Label>
                      <Input
                        id="start-page"
                        type="number"
                        min={1}
                        max={pageCount}
                        value={startPage}
                        onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Will extract pages {Math.max(1, startPage)} to {pageCount}
                      </p>
                    </div>
                  )}

                  {splitMode === "range" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="range-start">Start page</Label>
                        <Input
                          id="range-start"
                          type="number"
                          min={1}
                          max={pageCount}
                          value={startPage}
                          onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="range-end">End page</Label>
                        <Input
                          id="range-end"
                          type="number"
                          min={1}
                          max={pageCount}
                          value={endPage}
                          onChange={(e) => setEndPage(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground sm:col-span-2">
                        Will extract pages {Math.max(1, startPage)} to {Math.min(endPage, pageCount)}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleSplit}
                    disabled={isProcessing}
                    className="w-full cursor-pointer"
                    size="lg"
                  >
                    <Scissors className="h-5 w-5 mr-2" />
                    {isProcessing ? "Splitting PDF..." : "Split PDF"}
                  </Button>
                </div>
              )}
            </div>
          )}
    </Layout>
  );
};

export default SplitPage;
