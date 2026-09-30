import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure the worker source for Vite bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Extracts all pages from a PDF file as crisp, high-resolution JPEG images.
 * 
 * @param {File} pdfFile - The uploaded PDF file
 * @param {Object} options
 * @param {Function} [options.onProgress] - Callback (current, total, percent)
 * @param {number} [options.targetWidth=1600] - Ideal target width in pixels for comic panels
 * @param {number} [options.quality=0.88] - JPEG quality (0.0 to 1.0)
 * @returns {Promise<Array<File>>} List of File objects ready for chapter upload
 */
export async function extractImagesFromPdf(pdfFile, options = {}) {
  const {
    onProgress = () => {},
    targetWidth = 1600,
    quality = 0.88,
  } = options;

  if (!pdfFile) {
    throw new Error('No PDF file provided');
  }

  // Load array buffer from file
  const arrayBuffer = await pdfFile.arrayBuffer();

  // Load PDF document
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/cmaps/',
    cMapPacked: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  if (numPages === 0) {
    throw new Error('PDF has no pages');
  }

  const extractedFiles = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);

    // Calculate scale to achieve targetWidth for comic clarity
    const baseViewport = page.getViewport({ scale: 1.0 });
    const scale = Math.min(3.0, Math.max(1.2, targetWidth / baseViewport.width));
    const viewport = page.getViewport({ scale });

    // Render to offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d', { alpha: false });

    // White background in case of transparent background PDFs
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Convert canvas to high-quality JPEG Blob
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error(`Failed to render page ${pageNum} to image`));
        },
        'image/jpeg',
        quality
      );
    });

    // Clean up canvas
    canvas.width = 0;
    canvas.height = 0;

    const fileName = `page-${String(pageNum).padStart(3, '0')}.jpg`;
    const imageFile = new File([blob], fileName, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });

    extractedFiles.push(imageFile);

    // Free memory for rendered page
    if (typeof page.cleanup === 'function') {
      page.cleanup();
    }

    // Notify caller of extraction progress
    onProgress({
      current: pageNum,
      total: numPages,
      percent: Math.round((pageNum / numPages) * 100),
      fileName,
    });
  }

  // Destroy PDF doc when finished
  try {
    await pdfDoc.destroy();
  } catch {
    // ignore
  }

  return extractedFiles;
}

export default {
  extractImagesFromPdf,
};
