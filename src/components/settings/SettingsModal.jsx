import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Sliders,
  Moon,
  Sun,
  Monitor,
  BookOpen,
  Maximize2,
  Space,
  Palette,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import SettingSection from "./SettingSection";
import SettingRow from "./SettingRow";
import SettingOption from "./SettingOption";
import SettingToggle from "./SettingToggle";
import SettingDivider from "./SettingDivider";
import ResetConfirmModal from "./ResetConfirmModal";
import Button from "../common/Button";

/**
 * SettingsModal Component for NOVA PANEL
 * 
 * Strict Features:
 * - Desktop: Centered large modal with fixed header, scrollable body, and fixed footer
 * - Mobile: Responsive touch-friendly bottom sheet
 * - Controlled dark NOVA PANEL palette (#11131A, #171A22, #262A35, #F5F5F5, #E5A93C)
 * - Real functionality only:
 *   - Theme: Dark / System / Light (applied to <html> and synced)
 *   - Reader Width: Compact (672px) / Comfortable (768px) / Wide (1024px)
 *   - Page Spacing: None (0px) / Small (8px) / Medium (16px) / Large (32px)
 *   - Reader Tone: Dark Slate / Pitch Black / Deep Dim
 *   - Auto Resume Progress toggle
 *   - Preferred Story Format: All / Manhwa / Manga / Webtoon
 * - Reset to defaults with confirmation dialog
 * - Subtle "Saved" feedback pill
 * - Keyboard navigation, ESC key dismissal, click-outside dismissal
 * - Locks body scroll while open
 */
export default function SettingsModal() {
  const {
    settings,
    isSettingsOpen,
    closeSettings,
    updateTheme,
    updateReaderSetting,
    updateContentSetting,
    resetSettings,
    showSavedFeedback,
  } = useSettings();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Lock background scroll when open
  useEffect(() => {
    if (isSettingsOpen) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSettingsOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSettingsOpen && !isResetConfirmOpen) {
        closeSettings();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen, isResetConfirmOpen, closeSettings]);

  if (!isSettingsOpen) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-heading"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
      >
        {/* Backdrop */}
        <div
          onClick={closeSettings}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <div
          ref={modalRef}
          className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-[#11131A] border border-[#262A35] shadow-2xl flex flex-col overflow-hidden animate-hero-content z-10"
        >
          {/* Header */}
          <div className="shrink-0 px-5 sm:px-7 py-4 sm:py-5 border-b border-[#262A35] flex items-center justify-between bg-[#11131A]/95 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shadow-glow-sm">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="settings-heading"
                    className="text-base sm:text-lg font-black text-content-primary tracking-tight"
                  >
                    Settings
                  </h2>
                  {showSavedFeedback && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 animate-fadeIn">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      Saved
                    </span>
                  )}
                </div>
                <p className="text-xs text-content-secondary mt-0.5">
                  Customize your NOVA PANEL experience
                </p>
              </div>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeSettings}
              aria-label="Close settings"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-content-secondary hover:text-content-primary hover:bg-white/5 border border-transparent hover:border-[#262A35] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div
            tabIndex={0}
            className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-7 space-y-6 sm:space-y-7 focus:outline-none"
          >
            {/* 1. APPEARANCE SETTINGS */}
            <SettingSection
              title="Appearance"
              description="Select the interface palette that best suits your ambient environment."
              icon={<Palette className="w-3.5 h-3.5" />}
            >
              <div
                role="radiogroup"
                aria-label="Interface theme"
                className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
              >
                <SettingOption
                  selected={settings.theme === "dark"}
                  onClick={() => updateTheme("dark")}
                  title="Dark"
                  description="Editorial obsidian"
                  icon={<Moon className="w-4 h-4" />}
                />
                <SettingOption
                  selected={settings.theme === "system"}
                  onClick={() => updateTheme("system")}
                  title="System"
                  description="Follows OS setting"
                  icon={<Monitor className="w-4 h-4" />}
                />
                <SettingOption
                  selected={settings.theme === "light"}
                  onClick={() => updateTheme("light")}
                  title="Light"
                  description="Daylight canvas"
                  icon={<Sun className="w-4 h-4" />}
                />
              </div>
            </SettingSection>

            {/* 2. READING EXPERIENCE SETTINGS */}
            <SettingSection
              title="Reading Experience"
              description="Fine-tune the reader canvas layout, spacing, and contrast for maximum comfort."
              icon={<BookOpen className="w-3.5 h-3.5" />}
            >
              {/* Reader Width */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-content-primary flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-accent" />
                    Reader Width
                  </span>
                  <span className="text-content-muted font-mono text-[11px]">
                    {settings.reader.pageWidth === "compact"
                      ? "672px"
                      : settings.reader.pageWidth === "wide"
                      ? "1024px"
                      : "768px"}
                  </span>
                </div>
                <div
                  role="radiogroup"
                  aria-label="Reader canvas width"
                  className="grid grid-cols-3 gap-2"
                >
                  <SettingOption
                    selected={settings.reader.pageWidth === "compact"}
                    onClick={() => updateReaderSetting("pageWidth", "compact")}
                    title="Compact"
                    badge="672px"
                  />
                  <SettingOption
                    selected={settings.reader.pageWidth === "comfortable"}
                    onClick={() => updateReaderSetting("pageWidth", "comfortable")}
                    title="Comfortable"
                    badge="768px"
                  />
                  <SettingOption
                    selected={settings.reader.pageWidth === "wide"}
                    onClick={() => updateReaderSetting("pageWidth", "wide")}
                    title="Wide"
                    badge="1024px"
                  />
                </div>
              </div>

              <SettingDivider />

              {/* Page Spacing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-content-primary flex items-center gap-1.5">
                    <Space className="w-3.5 h-3.5 text-accent" />
                    Page Spacing
                  </span>
                  <span className="text-content-muted font-mono text-[11px]">
                    {settings.reader.pageSpacing === "none"
                      ? "0px (Seamless)"
                      : settings.reader.pageSpacing === "small"
                      ? "8px"
                      : settings.reader.pageSpacing === "large"
                      ? "32px"
                      : "16px"}
                  </span>
                </div>
                <div
                  role="radiogroup"
                  aria-label="Page spacing"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  <SettingOption
                    selected={settings.reader.pageSpacing === "none"}
                    onClick={() => updateReaderSetting("pageSpacing", "none")}
                    title="None"
                    badge="0px"
                  />
                  <SettingOption
                    selected={settings.reader.pageSpacing === "small"}
                    onClick={() => updateReaderSetting("pageSpacing", "small")}
                    title="Small"
                    badge="8px"
                  />
                  <SettingOption
                    selected={settings.reader.pageSpacing === "medium"}
                    onClick={() => updateReaderSetting("pageSpacing", "medium")}
                    title="Medium"
                    badge="16px"
                  />
                  <SettingOption
                    selected={settings.reader.pageSpacing === "large"}
                    onClick={() => updateReaderSetting("pageSpacing", "large")}
                    title="Large"
                    badge="32px"
                  />
                </div>
              </div>

              <SettingDivider />

              {/* Reader Background Tone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-content-primary block">
                  Reader Canvas Tone
                </label>
                <div
                  role="radiogroup"
                  aria-label="Reader canvas tone"
                  className="grid grid-cols-3 gap-2"
                >
                  <SettingOption
                    selected={settings.reader.readerBackground === "dark"}
                    onClick={() => updateReaderSetting("readerBackground", "dark")}
                    title="Slate"
                    description="#090A0F"
                  />
                  <SettingOption
                    selected={settings.reader.readerBackground === "black"}
                    onClick={() => updateReaderSetting("readerBackground", "black")}
                    title="Pitch Black"
                    description="#000000"
                  />
                  <SettingOption
                    selected={settings.reader.readerBackground === "dim"}
                    onClick={() => updateReaderSetting("readerBackground", "dim")}
                    title="Deep Dim"
                    description="#12151D"
                  />
                </div>
              </div>

              <SettingDivider />

              {/* Auto Resume Progress Toggle */}
              <SettingRow
                label="Auto Resume Reading Position"
                description="Automatically prompt to jump to the last read page when opening a chapter."
              >
                <SettingToggle
                  checked={settings.reader.autoResume}
                  onChange={(val) => updateReaderSetting("autoResume", val)}
                  label="Auto Resume Reading Position"
                />
              </SettingRow>
            </SettingSection>

            {/* 3. CONTENT PREFERENCES */}
            <SettingSection
              title="Content Preferences"
              description="Customize your default catalog presentation and filtering preferences."
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-content-primary block">
                  Preferred Default Format
                </label>
                <div
                  role="radiogroup"
                  aria-label="Preferred story format"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  {[
                    { id: "all", label: "All Formats" },
                    { id: "manhwa", label: "Manhwa" },
                    { id: "manga", label: "Manga" },
                    { id: "webtoon", label: "Webtoon" },
                  ].map((fmt) => (
                    <SettingOption
                      key={fmt.id}
                      selected={settings.content.preferredType === fmt.id}
                      onClick={() => updateContentSetting("preferredType", fmt.id)}
                      title={fmt.label}
                    />
                  ))}
                </div>
              </div>

              <SettingDivider />

              <SettingRow
                label="Highlight Bingeable Serials"
                description="Display prominent badges on completed stories ready for uninterrupted reading."
              >
                <SettingToggle
                  checked={settings.content.highlightCompleted}
                  onChange={(val) => updateContentSetting("highlightCompleted", val)}
                  label="Highlight Completed Stories"
                />
              </SettingRow>
            </SettingSection>
          </div>

          {/* Fixed Footer */}
          <div className="shrink-0 px-5 sm:px-7 py-3.5 sm:py-4 border-t border-[#262A35] flex items-center justify-between bg-[#11131A]/95 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-muted hover:text-rose-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded-lg px-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to defaults</span>
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={closeSettings}
              className="font-bold tracking-wider px-6 uppercase shadow-glow-sm"
            >
              Done
            </Button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onCancel={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetSettings();
          setIsResetConfirmOpen(false);
        }}
      />
    </>
  );
}
