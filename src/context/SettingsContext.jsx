import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const SETTINGS_STORAGE_KEY = "nova_panel_user_settings";

export const DEFAULT_SETTINGS = {
  theme: "dark", // "dark" | "system" | "light"
  reader: {
    pageWidth: "comfortable", // "compact" (max-w-2xl) | "comfortable" (max-w-3xl) | "wide" (max-w-5xl)
    pageSpacing: "medium", // "none" (space-y-0) | "small" (space-y-2) | "medium" (space-y-4) | "large" (space-y-8)
    readerBackground: "dark", // "dark" (#090A0F) | "black" (#000000) | "dim" (#12151D)
    readingDirection: "vertical", // "vertical" | "ltr" | "rtl"
    autoResume: true, // auto prompt / resume last reading progress
  },
  content: {
    preferredType: "all", // "all" | "manhwa" | "manga" | "manhua" | "webtoon"
    highlightCompleted: false, // highlight completed bingeable series
  },
};

function getStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      reader: { ...DEFAULT_SETTINGS.reader, ...(parsed.reader || {}) },
      content: { ...DEFAULT_SETTINGS.content, ...(parsed.content || {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(getStoredSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Apply Theme to document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (themeName) => {
      let isDark = true;
      if (themeName === "light") {
        isDark = false;
      } else if (themeName === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme(settings.theme);

    // If system theme, listen to system color scheme changes
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [settings.theme]);

  // Persist settings to localStorage & trigger saved feedback
  const persistSettings = useCallback((newSettings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setShowSavedFeedback(true);
      const timer = setTimeout(() => setShowSavedFeedback(false), 2000);
      return () => clearTimeout(timer);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const updateTheme = useCallback((theme) => {
    setSettings((prev) => {
      const next = { ...prev, theme };
      persistSettings(next);
      return next;
    });
  }, [persistSettings]);

  const updateReaderSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        reader: {
          ...prev.reader,
          [key]: value,
        },
      };
      persistSettings(next);
      return next;
    });
  }, [persistSettings]);

  const updateContentSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        content: {
          ...prev.content,
          [key]: value,
        },
      };
      persistSettings(next);
      return next;
    });
  }, [persistSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 2000);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isSettingsOpen,
        openSettings,
        closeSettings,
        updateTheme,
        updateReaderSetting,
        updateContentSetting,
        resetSettings,
        showSavedFeedback,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
