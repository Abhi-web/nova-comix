import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Layers,
  ArrowUp,
  ArrowDown,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileImage,
  FileText,
  Sparkles,
  X,
  Send,
  FileEdit,
  Loader2,
  Zap,
} from 'lucide-react';
import storageService from '../../services/storageService';
import { optimizeComicImage } from '../../utils/imageOptimizer';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function AdminChapterPagesManager({
  chapter,
  manga,
  onChapterUpdated,
}) {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  // Pages state from chapter
  const pages = chapter?.pages || [];

  // Upload queue state
  const [queue, setQueue] = useState([]); // [{ id, file, name, size, status: 'pending'|'uploading'|'done'|'error', error }]
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ total: 0, current: 0, failed: 0 });
  const [cancelUploads, setCancelUploads] = useState(false);

  // PDF Extraction state
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState({ current: 0, total: 0, percent: 0, fileName: '' });

  // Single page replacement state
  const [pageToReplace, setPageToReplace] = useState(null);
  const [replacing, setReplacing] = useState(false);

  // Preview modal state
  const [previewPage, setPreviewPage] = useState(null);

  // Publishing / status toggling state
  const [publishing, setPublishing] = useState(false);

  // Handle PDF file selection and automatic page-by-page conversion
  const handlePdfSelected = async (pdfFile) => {
    if (!pdfFile) return;

    const isPdf =
      pdfFile.type === 'application/pdf' ||
      pdfFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      toast.error('Please select a valid PDF file (.pdf)');
      return;
    }

    if (pdfFile.size > 250 * 1024 * 1024) {
      toast.error('PDF file size is too large (maximum limit is 250MB).');
      return;
    }

    setIsExtractingPdf(true);
    setPdfProgress({
      current: 0,
      total: 0,
      percent: 0,
      fileName: pdfFile.name,
    });

    try {
      toast.info(`Extracting comic pages from "${pdfFile.name}"...`);

      const { extractImagesFromPdf } = await import('../../utils/pdfExtractor');

      const extractedFiles = await extractImagesFromPdf(pdfFile, {
        targetWidth: 1600,
        quality: 0.88,
        onProgress: ({ current, total, percent }) => {
          setPdfProgress({
            current,
            total,
            percent,
            fileName: pdfFile.name,
          });
        },
      });

      const queueItems = extractedFiles.map((file, idx) => ({
        id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        name: file.name,
        size: file.size,
        status: 'pending',
        error: null,
      }));

      setQueue((prev) => [...prev, ...queueItems]);
      toast.success(
        `Successfully extracted ${extractedFiles.length} pages from "${pdfFile.name}"! Click "Start Upload" to send to Cloud Storage.`
      );
    } catch (err) {
      console.error('PDF extraction failed:', err);
      toast.error(err.message || 'Failed to extract pages from PDF.');
    } finally {
      setIsExtractingPdf(false);
      if (pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
    }
  };

  // Handle files selected from file picker or drag-and-drop
  const handleFilesSelected = (fileList) => {
    const filesArray = Array.from(fileList);

    // If a PDF is included, process the PDF
    const pdfFile = filesArray.find(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFile) {
      handlePdfSelected(pdfFile);
      return;
    }

    const validFiles = filesArray.filter((file) => {
      const isImg = file.type.startsWith('image/');
      const isValidExt = /\.(jpg|jpeg|png|webp)$/i.test(file.name);
      return isImg || isValidExt;
    });

    if (validFiles.length === 0) {
      toast.error('No supported image or PDF files found. Please select JPG, PNG, WEBP images or a PDF file.');
      return;
    }

    // Sort files naturally by filename (e.g. 1.jpg, 2.jpg ... 10.jpg)
    validFiles.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    );

    const initialQueueItems = validFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      file,
      name: file.name,
      size: file.size,
      originalSize: file.size,
      wasOptimized: false,
      isOptimizing: file.size > 500 * 1024,
      status: 'pending',
      error: null,
    }));

    setQueue((prev) => [...prev, ...initialQueueItems]);

    // Optimize large comic scans (e.g. 3-8MB) in background down to ~350KB HD for 10x faster uploads
    initialQueueItems.forEach((item) => {
      if (item.file.size > 500 * 1024) {
        optimizeComicImage(item.file)
          .then((res) => {
            if (res.wasOptimized) {
              setQueue((prev) =>
                prev.map((q) =>
                  q.id === item.id
                    ? {
                        ...q,
                        file: res.file,
                        size: res.optimizedSize,
                        originalSize: res.originalSize,
                        wasOptimized: true,
                        isOptimizing: false,
                      }
                    : q
                )
              );
            } else {
              setQueue((prev) =>
                prev.map((q) => (q.id === item.id ? { ...q, isOptimizing: false } : q))
              );
            }
          })
          .catch(() => {
            setQueue((prev) =>
              prev.map((q) => (q.id === item.id ? { ...q, isOptimizing: false } : q))
            );
          });
      }
    });
  };

  // Start rock-solid upload queue (Sequential execution prevents Mongoose version conflicts and Google Drive rate limits)
  const startUpload = async () => {
    if (queue.length === 0) return;
    setIsUploading(true);
    setCancelUploads(false);

    const pendingItems = queue.filter((item) => item.status === 'pending' || item.status === 'error');
    setUploadProgress({ total: pendingItems.length, current: 0, failed: 0 });

    let failedCount = 0;
    let successCount = 0;

    for (let i = 0; i < pendingItems.length; i++) {
      if (cancelUploads) break;
      const item = pendingItems[i];

      // Mark item as uploading
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', error: null } : q))
      );

      try {
        let fileToUpload = item.file;
        // On-the-fly optimization if still large
        if (!item.wasOptimized && fileToUpload.size > 500 * 1024) {
          const opt = await optimizeComicImage(fileToUpload);
          if (opt.wasOptimized) {
            fileToUpload = opt.file;
          }
        }

        await storageService.uploadChapterPages(chapter._id, fileToUpload);
        successCount += 1;
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'done', error: null } : q))
        );

        // Immediately notify parent to update chapter pages view
        if (onChapterUpdated) {
          onChapterUpdated();
        }
      } catch (err) {
        failedCount += 1;
        const errMsg = err.message || 'Upload failed. Check network or storage.';
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'error', error: errMsg } : q))
        );
      }

      setUploadProgress({
        total: pendingItems.length,
        current: successCount,
        failed: failedCount,
      });
    }

    setIsUploading(false);
    if (onChapterUpdated) {
      onChapterUpdated();
    }

    if (failedCount === 0) {
      toast.success(`Successfully uploaded ${successCount} pages.`);
      // Clear completed queue after 2.5s
      setTimeout(() => {
        setQueue((prev) => prev.filter((q) => q.status !== 'done'));
      }, 2500);
    } else {
      toast.error(`${successCount} of ${pendingItems.length} uploaded — ${failedCount} failed.`);
    }
  };

  const handleCancelUpload = () => {
    setCancelUploads(true);
    setIsUploading(false);
    toast.info('Upload process stopped.');
  };

  const retryFailed = () => {
    setQueue((prev) =>
      prev.map((q) => (q.status === 'error' ? { ...q, status: 'pending', error: null } : q))
    );
  };

  const retrySingle = (itemId) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === itemId ? { ...q, status: 'pending', error: null } : q))
    );
  };

  const clearQueue = () => {
    setQueue([]);
  };

  // Reorder page up or down
  const handleMovePage = async (pageIndex, direction) => {
    const targetIndex = direction === 'up' ? pageIndex - 1 : pageIndex + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const newPages = [...pages];
    const temp = newPages[pageIndex];
    newPages[pageIndex] = newPages[targetIndex];
    newPages[targetIndex] = temp;

    // Build pageOrders
    const pageOrders = newPages.map((p, idx) => ({
      pageId: p._id || p.fileId,
      pageNumber: idx + 1,
    }));

    try {
      await storageService.reorderPages(chapter._id, pageOrders);
      toast.success('Page order updated');
      if (onChapterUpdated) onChapterUpdated();
    } catch (err) {
      toast.error(err.message || 'Failed to reorder pages');
    }
  };

  // Trigger page replacement
  const handleReplaceClick = (page) => {
    setPageToReplace(page);
    if (replaceInputRef.current) {
      replaceInputRef.current.value = '';
      replaceInputRef.current.click();
    }
  };

  const handleReplaceFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !pageToReplace) return;

    setReplacing(true);
    try {
      const pageId = pageToReplace._id || pageToReplace.fileId;
      await storageService.replacePage(chapter._id, pageId, file);
      toast.success(`Page ${pageToReplace.pageNumber} replaced successfully.`);
      if (onChapterUpdated) onChapterUpdated();
    } catch (err) {
      toast.error(err.message || 'Failed to replace page');
    } finally {
      setReplacing(false);
      setPageToReplace(null);
    }
  };

  // Delete page
  const handleDeletePage = async (page) => {
    if (!window.confirm(`Delete Page ${page.pageNumber}? Associated Drive file will be removed.`)) {
      return;
    }

    try {
      const pageId = page._id || page.fileId;
      await storageService.deletePage(chapter._id, pageId);
      toast.success(`Page ${page.pageNumber} deleted.`);
      if (onChapterUpdated) onChapterUpdated();
    } catch (err) {
      toast.error(err.message || 'Failed to delete page');
    }
  };

  // Publish with validation (Requirement 17)
  const handlePublish = async () => {
    if (!pages || pages.length === 0) {
      toast.error('Cannot publish chapter with 0 pages. Upload at least 1 page first.');
      return;
    }

    setPublishing(true);
    try {
      await storageService.publishChapter(chapter._id);
      toast.success(`Chapter ${chapter.number} is now published and live!`);
      if (onChapterUpdated) onChapterUpdated();
    } catch (err) {
      toast.error(err.message || 'Publishing validation failed.');
    } finally {
      setPublishing(false);
    }
  };

  // Unpublish / Draft
  const handleUnpublish = async () => {
    setPublishing(true);
    try {
      await storageService.unpublishChapter(chapter._id);
      toast.info(`Chapter ${chapter.number} changed to Draft.`);
      if (onChapterUpdated) onChapterUpdated();
    } catch (err) {
      toast.error(err.message || 'Failed to unpublish chapter.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Page Replacement */}
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplaceFileSelected}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {/* Chapter Status & Action Banner */}
      <div className="p-6 rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-content-primary">
              Chapter {chapter?.number} {chapter?.title ? `— ${chapter.title}` : ''}
            </h2>
            <Badge
              variant={chapter?.status === 'published' ? 'success' : 'warning'}
              size="sm"
            >
              {chapter?.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>
          <p className="text-xs text-content-secondary mt-1 font-medium">
            <span className="text-accent font-bold font-mono">{pages.length}</span> total pages uploaded to Google Drive Cloud Storage
          </p>
        </div>

        {/* Publish / Unpublish Actions */}
        <div className="flex items-center gap-3">
          {chapter?.status === 'published' ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={publishing}
              onClick={handleUnpublish}
              className="text-amber-400 hover:text-amber-300 border-amber-500/30"
            >
              <FileEdit className="w-3.5 h-3.5 mr-1.5" />
              Unpublish to Draft
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={publishing || pages.length === 0}
              onClick={handlePublish}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/40"
            >
              {publishing ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 mr-1.5" />
              )}
              Publish Chapter
            </Button>
          )}
        </div>
      </div>

      {/* PDF Extraction Progress Banner */}
      {isExtractingPdf && (
        <div className="p-6 rounded-2xl border border-accent/40 bg-accent/10 backdrop-blur-md shadow-glow-accent/10 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-content-primary">
                    Converting Chapter PDF to HD Pages
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[11px] text-accent font-semibold px-2 py-0.5 rounded-full bg-accent/15 border border-accent/25">
                    <Sparkles className="w-3 h-3" /> HD 1600px
                  </span>
                </div>
                <p className="text-xs text-content-secondary mt-0.5 font-mono truncate max-w-sm">
                  {pdfProgress.fileName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-mono font-bold text-accent">
                {pdfProgress.percent}%
              </span>
              <p className="text-[11px] text-content-tertiary">
                Page {pdfProgress.current} of {pdfProgress.total}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-background-elevated rounded-full overflow-hidden border border-border-subtle">
            <div
              className="h-full bg-gradient-to-r from-accent to-pink-500 transition-all duration-200"
              style={{ width: `${pdfProgress.percent}%` }}
            />
          </div>
          <p className="text-[11px] text-content-tertiary text-center">
            Extracting panels and formatting pages. Extracted pages will automatically populate your upload queue.
          </p>
        </div>
      )}

      {/* Multi-Page & PDF Upload Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) {
            handleFilesSelected(e.dataTransfer.files);
          }
        }}
        className="p-8 sm:p-10 rounded-2xl border-2 border-dashed border-border-subtle hover:border-accent/70 bg-background-card/50 hover:bg-background-elevated/40 transition-all text-center group shadow-card"
      >
        {/* Hidden File Input for Multiple Images */}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            if (e.target.files) {
              handleFilesSelected(e.target.files);
            }
          }}
          className="hidden"
        />

        {/* Hidden File Input for PDF */}
        <input
          type="file"
          ref={pdfInputRef}
          accept="application/pdf,.pdf"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handlePdfSelected(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-13 h-13 p-3 rounded-2xl bg-accent/15 border border-accent/30 text-accent group-hover:scale-105 transition-transform duration-300 shadow-glow-accent/20">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="w-13 h-13 p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 group-hover:scale-105 transition-transform duration-300">
            <FileText className="w-7 h-7" />
          </div>
        </div>

        <h3 className="text-base font-bold text-content-primary mb-1">
          Upload Chapter Pages or Entire PDF
        </h3>
        <p className="text-xs text-content-secondary max-w-lg mx-auto leading-relaxed mb-6">
          Drag & drop your files here, or choose between uploading loose image pages or a complete chapter PDF document (automatically converted to HD pages).
        </p>

        {/* Upload Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={isExtractingPdf || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background-elevated hover:bg-background-card border border-border-subtle hover:border-accent/50 text-content-primary text-xs font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <FileImage className="w-4 h-4 text-accent" />
            <span>Select Images (JPG, PNG, WEBP)</span>
          </button>

          <button
            type="button"
            disabled={isExtractingPdf || isUploading}
            onClick={() => pdfInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent/90 to-purple-600 hover:from-accent hover:to-purple-500 text-white text-xs font-bold shadow-glow-accent/20 hover:shadow-glow-accent/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Upload Chapter PDF</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Auto Convert
            </span>
          </button>
        </div>
      </div>

      {/* Active Upload Queue Panel */}
      {queue.length > 0 && (
        <div className="p-5 rounded-xl border border-border-subtle bg-background-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary">
                Upload Queue ({queue.length} files selected)
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {!isUploading ? (
                <>
                  {queue.some((q) => q.status === 'error') && (
                    <Button variant="secondary" size="sm" onClick={retryFailed}>
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      Retry Failed ({queue.filter((q) => q.status === 'error').length})
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearQueue}>
                    Clear
                  </Button>
                  <Button variant="primary" size="sm" onClick={startUpload}>
                    Start Upload ({queue.filter((q) => q.status !== 'done').length} Pages)
                  </Button>
                </>
              ) : (
                <Button variant="secondary" size="sm" onClick={handleCancelUpload}>
                  Cancel Uploads
                </Button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-content-secondary">
                <span className="inline-flex items-center gap-1.5 text-accent font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading page {Math.min(uploadProgress.current + 1, uploadProgress.total)} of {uploadProgress.total}...
                </span>
                <span>
                  {uploadProgress.current} / {uploadProgress.total} Completed{' '}
                  {uploadProgress.failed > 0 && (
                    <span className="text-rose-400 font-medium">({uploadProgress.failed} Failed)</span>
                  )}
                </span>
              </div>
              <div className="w-full h-2 bg-background-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{
                    width: `${
                      uploadProgress.total > 0
                        ? Math.round((uploadProgress.current / uploadProgress.total) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Queue List Preview */}
          <div className="max-h-60 overflow-y-auto divide-y divide-border-subtle/50 text-xs">
            {queue.map((item) => (
              <div key={item.id} className="py-2 space-y-1">
                <div className="flex items-center justify-between gap-3 text-content-secondary">
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <FileImage className="w-3.5 h-3.5 text-content-tertiary shrink-0" />
                    <span className="truncate">{item.name}</span>
                    <span className="text-[10px] text-content-tertiary shrink-0 font-mono">
                      ({Math.round(item.size / 1024)} KB)
                    </span>
                    {item.wasOptimized && (
                      <span
                        className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-0.5"
                        title={`Original: ${Math.round(item.originalSize / 1024)} KB → Optimized: ${Math.round(item.size / 1024)} KB`}
                      >
                        <Zap className="w-2.5 h-2.5" /> HD Fast (-{Math.round((1 - item.size / item.originalSize) * 100)}%)
                      </span>
                    )}
                    {item.isOptimizing && (
                      <span className="shrink-0 text-[10px] text-accent inline-flex items-center gap-1 font-medium">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> Optimizing...
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'pending' && (
                      <span className="text-content-tertiary text-[11px]">Ready</span>
                    )}
                    {item.status === 'uploading' && (
                      <span className="inline-flex items-center gap-1 text-accent text-[11px] font-medium">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading...
                      </span>
                    )}
                    {item.status === 'done' && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Uploaded
                      </span>
                    )}
                    {item.status === 'error' && (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-rose-400 text-[11px]" title={item.error}>
                          <AlertCircle className="w-3.5 h-3.5" />
                          Failed
                        </span>
                        {!isUploading && (
                          <button
                            type="button"
                            onClick={() => retrySingle(item.id)}
                            className="px-1.5 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-medium"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    )}
                    {!isUploading && (
                      <button
                        onClick={() => setQueue((prev) => prev.filter((q) => q.id !== item.id))}
                        className="p-1 text-content-tertiary hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {item.status === 'error' && item.error && (
                  <div className="text-[10px] text-rose-400/90 pl-5 truncate">
                    Reason: {item.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Pages Grid & Page Order Manager */}
      <div className="p-6 rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card space-y-5">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div>
            <h3 className="text-base font-bold text-content-primary">
              Chapter Pages ({pages.length})
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Reorder pages, preview, replace, or remove before publishing to reader catalog
            </p>
          </div>
        </div>

        {pages.length === 0 ? (
          <div className="py-12 text-center text-xs text-content-tertiary">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-30 text-accent" />
            <p className="font-semibold text-content-secondary">No pages uploaded for this chapter yet.</p>
            <p className="mt-1">Drag and drop images into the box above to start uploading to Google Drive.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((page, idx) => {
              const accessUrl = storageService.getFileAccessUrl(page.fileId || page.imageUrl);
              return (
                <div
                  key={page._id || page.fileId || idx}
                  className="rounded-2xl border border-border-subtle bg-background-elevated/70 overflow-hidden flex flex-col group hover:border-accent/40 hover:shadow-card-hover transition-all duration-300"
                >
                  {/* Page Image Thumbnail */}
                  <div className="aspect-[3/4] bg-background-card relative overflow-hidden flex items-center justify-center">
                    <img
                      src={accessUrl}
                      alt={`Page ${page.pageNumber}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x400?text=Page+' + page.pageNumber;
                      }}
                    />

                    {/* Page Number Pill */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-bold text-accent border border-accent/25 shadow-glow-accent/10">
                      Page {page.pageNumber}
                    </div>

                    {/* Quick Preview Button */}
                    <button
                      onClick={() => setPreviewPage({ ...page, accessUrl })}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                    >
                      <Eye className="w-7 h-7 text-accent" />
                    </button>
                  </div>

                  {/* Page Actions Footer */}
                  <div className="p-2.5 bg-background-card border-t border-border-subtle/80 flex items-center justify-between text-xs">
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMovePage(idx, 'up')}
                        className="p-1 rounded hover:bg-background-elevated text-content-secondary disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === pages.length - 1}
                        onClick={() => handleMovePage(idx, 'down')}
                        className="p-1 rounded hover:bg-background-elevated text-content-secondary disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Replace & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleReplaceClick(page)}
                        disabled={replacing}
                        className="p-1 rounded hover:bg-background-elevated text-content-secondary hover:text-accent"
                        title="Replace Page"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page)}
                        className="p-1 rounded hover:bg-rose-500/10 text-content-tertiary hover:text-rose-400"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Page Preview Modal */}
      {previewPage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewPage(null)}
        >
          <div
            className="max-w-2xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-white mb-2">
              <span className="font-semibold text-sm">
                Page {previewPage.pageNumber} Preview
              </span>
              <button
                onClick={() => setPreviewPage(null)}
                className="p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewPage.accessUrl}
              alt={`Page ${previewPage.pageNumber}`}
              className="max-h-[80vh] w-auto object-contain rounded-lg border border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
