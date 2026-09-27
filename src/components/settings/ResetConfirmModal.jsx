import React, { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import Button from "../common/Button";

/**
 * ResetConfirmModal Component for NOVA PANEL
 * Confirmation dialog before resetting user preferences to factory defaults.
 */
export default function ResetConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}) {
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      cancelBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      aria-describedby="reset-desc"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
    >
      <div className="w-full max-w-sm rounded-2xl bg-[#11131A] border border-[#262A35] p-5 sm:p-6 shadow-2xl space-y-4 animate-scaleIn">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-accent flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 id="reset-title" className="text-sm sm:text-base font-bold text-content-primary">
              Reset all settings?
            </h4>
            <p id="reset-desc" className="text-xs text-content-secondary mt-0.5">
              Theme and reading preferences will revert to defaults. Bookmarks and history will remain untouched.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            ref={cancelBtnRef}
            variant="secondary"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            className="bg-rose-500/90 hover:bg-rose-500 text-white border-rose-600/30"
          >
            Reset Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
