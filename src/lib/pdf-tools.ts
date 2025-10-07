import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

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

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
};

export const convertImagesToPdfAndMerge = async (files: File[]): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    } else if (file.type.startsWith("image/")) {
      const arrayBuffer = await file.arrayBuffer();
      let image;

      if (file.type === "image/png") {
        image = await pdfDoc.embedPng(arrayBuffer);
      } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
        image = await pdfDoc.embedJpg(arrayBuffer);
      } else {
        console.warn(`Unsupported image format: ${file.type}`);
        continue;
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    } else {
      console.warn(`Unsupported file type: ${file.type}`);
    }
  }

  return await pdfDoc.save();
};

export const dividePdfIntoSinglePages = async (
  file: File
): Promise<Uint8Array[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  const singlePagePdfs: Uint8Array[] = [];

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);
    const pdfBytes = await newPdf.save();
    singlePagePdfs.push(pdfBytes);
  }

  return singlePagePdfs;
};

export const createZipFromPdfs = async (
  pdfFiles: Uint8Array[],
  baseFilename: string
): Promise<Blob> => {
  const zip = new JSZip();

  pdfFiles.forEach((pdfBytes, index) => {
    const filename = `${baseFilename}_page_${index + 1}.pdf`;
    zip.file(filename, pdfBytes);
  });

  return await zip.generateAsync({ type: "blob" });
};

export const downloadZip = (zipBlob: Blob, filename: string = "divided.zip") => {
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const deletePagesFromPdf = async (
  file: File,
  pagesToDelete: string
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  const deleteSet = new Set<number>();
  const parts = pagesToDelete.split(",").map(p => p.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      //Handle both complete and partial ranges (x- or -x)
      const [start, end] = part.split("-").map(s => s.trim());
      const startNum = start ? parseInt(start) : 1;
      const endNum = end ? parseInt(end) : totalPages;

      for (let i = startNum; i <= endNum && i <= totalPages; i++) {
        deleteSet.add(i);
      }
    } else if (part) {
      // Handle single page
      const pageNum = parseInt(part);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        deleteSet.add(pageNum);
      }
    }
  }

  const pagesToKeep = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(pageNum => !deleteSet.has(pageNum))
    .map(pageNum => pageNum - 1);

  if (pagesToKeep.length === 0) {
    throw new Error("Cannot delete all pages from the PDF");
  }

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdfDoc, pagesToKeep);
  pages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
};

export const compressPdf = async (file: File): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // Save with optimized settings to reduce file size
  return await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
  });
};

export const createPdfFromImages = async (files: File[]): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let image;

    if (file.type === "image/png") {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else {
      console.warn(`Unsupported image format: ${file.type}`);
      continue;
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return await pdfDoc.save();
};