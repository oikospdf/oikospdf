import { PDFDocument } from "pdf-lib";

export const downloadPdf = (pdfBytes: Uint8Array, filename: string = "merged.pdf") => {
    const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  
export const splitPdf = async (
    file: File,
    startPage: number,
    endPage: number
  ): Promise<Uint8Array> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();
  
    const validStart = Math.max(1, Math.min(startPage, totalPages));
    const validEnd = Math.max(validStart, Math.min(endPage, totalPages));
  
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(
      pdfDoc,
      Array.from({ length: validEnd - validStart + 1 }, (_, i) => validStart - 1 + i)
    );
    
    pages.forEach((page) => newPdf.addPage(page));
    
    return await newPdf.save();
  };