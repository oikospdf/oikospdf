import Layout from "@/components/Layout";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, EyeOff, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { downloadPdf, protectPdfWithPassword } from "@/lib/pdf-tools";
import { PDFDocument } from "pdf-lib";
import { SingleFileUploader } from "@/components/SingleFileUploader";

const ProtectPdfPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleProtect = async () => {
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    setIsProcessing(true);
    try {
      const pdfBytes = await protectPdfWithPassword(file, password);
      const originalName = file.name.replace(/\.pdf$/i, "");
      downloadPdf(pdfBytes, `${originalName}-protected.pdf`);
      toast.success("PDF protected successfully!");
    } catch (error) {
      console.error("Error protecting PDF:", error);
      toast.error("Failed to protect PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Protect PDF</h2>
        <p className="text-muted-foreground">
          Protect your PDF document with a password
        </p>
      </div>

      {!file ? (

        <SingleFileUploader
          onFileSelected={handleFileSelected}
          title="Drop PDF here or click to upload"
          description="Upload a PDF to protect"
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
                <p className="text-xs text-muted-foreground">
                  {pageCount} pages • {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Remove file"
                onClick={() => {
                  setFile(null);
                  setPageCount(0);
                }}
              >
                Remove
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />
          </div>

          <Button
            onClick={handleProtect}
            disabled={isProcessing || !file || !password}
            className="w-full"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            {isProcessing ? "Protecting..." : "Protect & Download"}
          </Button>

        </div>
      )}
    </Layout>
  );
};

export default ProtectPdfPage;

