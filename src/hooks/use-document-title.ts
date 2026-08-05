import { useEffect } from "react";

const APP_SUFFIX = "Google Docs Clone";

/**
 * Sets the browser tab title dynamically.
 * Appends the app name for consistency.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} – ${APP_SUFFIX}` : APP_SUFFIX;
    return () => {
      document.title = APP_SUFFIX;
    };
  }, [title]);
}
