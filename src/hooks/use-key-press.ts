import { useEffect } from "react";

/**
 * Triggers a callback when the specified key is pressed.
 * Useful for keyboard shortcuts in the editor.
 */
export function useKeyPress(
  key: string,
  callback: (e: KeyboardEvent) => void,
  withCtrl = false
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key && (!withCtrl || e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        callback(e);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, withCtrl]);
}
