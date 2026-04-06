"use client";

import { useEffect, useState } from "react";

type DataGateProps = {
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
  onContinueWithoutData: () => void;
  appName?: string;
  children: React.ReactNode;
};

const THEME_STORAGE_KEY = "fintrack-theme";
type ThemeMode = "light" | "dark";

export default function DataGate({
  isLoading,
  hasError,
  onRetry,
  onContinueWithoutData,
  appName = "Fintrack",
  children,
}: DataGateProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    setThemeMode(storedTheme === "dark" ? "dark" : "light");
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <>{children}</>;
  }

  const isDark = themeMode === "dark";
  const loadingBg = isDark ? "bg-[#081120]" : "bg-[#eef2f7]";
  const loadingText = isDark ? "text-[#e5eefc]" : "text-[#0f172a]";
  const mutedText = isDark ? "text-[#9ab0cf]" : "text-[#64748b]";
  const spinnerRing = isDark ? "border-[#2a3b5a]" : "border-[#cbd5e1]";
  const secondaryButton = isDark
    ? "bg-[#16233d] text-[#e5eefc]"
    : "bg-[#e2e8f0] text-[#0f172a]";

  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${loadingBg} ${loadingText} flex flex-col items-center justify-center px-4 transition-colors duration-200`}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-500 tracking-tight text-center">
          {appName}
        </h1>
        <div className={`mt-6 flex items-center gap-3 text-lg ${mutedText}`}>
          <span
            className={`h-5 w-5 rounded-full border-2 ${spinnerRing} border-t-blue-500 animate-spin`}
          />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={`min-h-screen ${loadingBg} ${loadingText} flex flex-col items-center justify-center px-4 transition-colors duration-200`}
      >
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-red-400 text-red-400 flex items-center justify-center text-3xl font-bold">
            !
          </div>
          <h2 className="text-4xl font-semibold mb-4">Connection Error</h2>
          <p className={`${mutedText} text-lg leading-8 mb-8`}>
            Could not connect to the backend or no data was found. Please ensure
            the server is running and the database is seeded.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onRetry}
              className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 font-medium"
            >
              Retry Connection
            </button>
            <button
              onClick={onContinueWithoutData}
              className={`px-6 py-3 rounded-md ${secondaryButton} hover:opacity-90 transition-colors duration-200 font-medium`}
            >
              Proceed without Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
