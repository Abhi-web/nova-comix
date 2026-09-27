import React, { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Layers,
  ArrowUp,
  ArrowDown,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileImage,
  X,
  Send,
  FileEdit,
  Loader2,
} from 'lucide-react';
import storageService from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';
import Badge from '../common/Badge';

const MAX_CONCURRENT = 3;

export default function AdminChapterPagesManager({
  chapter,
  manga,
  onChapterUpdated,
}) {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  // Pages state from chapter
  const pages = chapter?.pages || [];

  // Upload queue state
  const [queue, setQueue] = useState([]); // [{ id, file, name, size, status: 'pending'|'uploading'|'done'|'error', error }]
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ total: 0, current: 0, failed: 0 });
  const [cancelUploads, setCancelUploads] = useState(false);

  // Single page replacement state
  const [pageToReplace, setPageToReplace] = useState(null);
  const [replacing, setReplacing] = useState(false);

  // Preview modal state
  const [previewPage, setPreviewPage] = useState(null);

  // Publishing / status toggling state
  const [publishing, setPublishing] = useState(false);

  // Handle files selected from file picker or drag-and-drop
  const handleFilesSelected = (fileList) => {
    const validFiles = Array.from(fileList).filter((file) => {
      const isImg = file.type.startsWith('image/');
      const isValidExt = /\.(jpg|jpeg|png|webp)$/i.test(file.name);
      return isImg || isValidExt;
    });

    if (validFiles.length === 0) {
      toast.error('No supported image files found. Please select JPG, PNG, or WEBP images.');
      return;
    }

    // Sort files naturally by filename (e.g. 1.jpg, 2.jpg ... 10.jpg)
    validFiles.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    );

    const queueItems = validFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      error: null,
    }));

    setQueue((prev) => [...prev, ...queueItems]);
  };

  // Start concurrent batch upload
  const startUpload = async () => {
    if (queue.length === 0) return;
    setIsUploading(true);
    setCancelUploads(false);

    const pendingItems = queue.filter((item) => item.status === 'pending' || item.status === 'error');
    setUploadProgress({ total: pendingItems.length, current: 0, failed: 0 });

    let currentIdx = 0;
    let failedCount = 0;
    let successCount = 0;

    const runWorker = async () => {
      while (currentIdx < pendingItems.length) {
        if (cancelUploads) break;

        const item = pendingItems[currentIdx];
        currentIdx += 1;

        // Mark item as uploading
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading' } : q))
        );

        try {
          await storageService.uploadChapterPages(chapter._id, item.file);
          successCount += 1;
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: 'done' } : q))
          );
        } catch (err) {
          failedCount += 1;
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: 'error', error: err.message } : q))
          );
        }

        setUploadProgress((prev) => ({
          ...prev,
          current: successCount,
          failed: failedCount,
        }));
      }
    };

    // Run MAX_CONCURRENT workers in parallel
    const workers = Array.from(
      { length: Math.min(MAX_CONCURRENT, pendingItems.length) },
      () => runWorker()
    );

    await Promise.all(workers);

    setIsUploading(false);
    if (onChapterUpdated) {
      onChapterUpdated();
    }

    if (failedCount === 0) {
      toast.success(`Successfully uploaded ${successCount} pages.`);
      // Clear completed queue after 2s
      setTimeout(() => {
        setQueue((prev) => prev.filter((q) => q.status !== 'done'));
      }, 2000);
    } else {
      toast.error(`${successCount} of ${pendingItems.length} uploaded — ${failedCount} failed.`);
    }
  };

  const handleCancelUpload = () => {
    setCancelUploads(true);
    setIsUploading(false);
    toast.info('Upload process stopped.');
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

      {/* Multi-Page Upload Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) {
            handleFilesSelected(e.dataTransfer.files);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className="p-8 sm:p-10 rounded-2xl border-2 border-dashed border-border-subtle hover:border-accent/70 bg-background-card/50 hover:bg-background-elevated/40 transition-all text-center cursor-pointer group shadow-card"
      >
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
        <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-glow-accent/20">
          <UploadCloud className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-content-primary mb-1">
          Click or Drag & Drop Chapter Pages
        </h3>
        <p className="text-xs text-content-secondary max-w-md mx-auto leading-relaxed">
          Select multiple images (JPG, PNG, WEBP). Pages will be uploaded to Google Drive with automated natural sorting.
        </p>
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
                  <Button variant="ghost" size="sm" onClick={clearQueue}>
                    Clear
                  </Button>
                  <Button variant="primary" size="sm" onClick={startUpload}>
                    Start Upload ({queue.length} Pages)
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
                <span>
                  Uploading queue with controlled concurrency (Max {MAX_CONCURRENT} at once)...
                </span>
                <span>
                  {uploadProgress.current} / {uploadProgress.total} Completed{' '}
                  {uploadProgress.failed > 0 && `(${uploadProgress.failed} Failed)`}
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
              <div
                key={item.id}
                className="py-2 flex items-center justify-between gap-3 text-content-secondary"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileImage className="w-3.5 h-3.5 text-content-tertiary shrink-0" />
                  <span className="truncate">{item.name}</span>
                  <span className="text-[10px] text-content-tertiary shrink-0">
                    ({Math.round(item.size / 1024)} KB)
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'pending' && (
                    <span className="text-content-tertiary text-[11px]">Ready</span>
                  )}
                  {item.status === 'uploading' && (
                    <span className="inline-flex items-center gap-1 text-accent text-[11px]">
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
                    <span className="inline-flex items-center gap-1 text-rose-400 text-[11px]" title={item.error}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      Failed
                    </span>
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
