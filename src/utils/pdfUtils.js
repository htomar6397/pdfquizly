import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker?url';
import Tesseract from 'tesseract.js';

GlobalWorkerOptions.workerSrc = workerSrc;

async function isScannedPDF(page) {
  try {
    // Try to extract text directly
    const textContent = await page.getTextContent();
    const text = textContent.items.map(item => item.str).join(' ');
    
    // If we get very little text, it's likely a scanned PDF
    return text.trim().length < 50;
  } catch {
    // If text extraction fails, assume it's a scanned PDF
    return true;
  }
}

export async function extractTextFromPDF(file, onProgress) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      if (onProgress) {
        const progress = Math.round(((i - 1) / pdf.numPages) * 100);
        onProgress(progress);
      }

      const page = await pdf.getPage(i);
      const isScanned = await isScannedPDF(page);

      if (!isScanned) {
        // Handle digital PDFs (with selectable text)
        const textContent = await page.getTextContent();
        text += textContent.items.map(item => item.str).join(' ') + '\n\n';
      } else {
        // Handle scanned PDFs with OCR
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const result = await Tesseract.recognize(
          canvas,
          'eng',
          {
            logger: progress => {
              if (onProgress) {
                const pageProgress = (i - 1 + (progress.progress || 0)) / pdf.numPages * 100;
                onProgress(Math.round(pageProgress));
              }
            }
          }
        );
        text += result.data.text + '\n\n';
      }
    } catch (error) {
      console.error(`Error processing page ${i}:`, error);
      throw new Error(`Failed to process page ${i}. Please try again.`);
    }
  }

  return text.trim();
}

