"use client";

import { useEditorStore } from "@/store/use-editor-store";

export function WordCount() {
  const { editor } = useEditorStore();

  if (!editor) return null;

  const text = editor.getText();
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground px-3 py-1 border-t">
      <span>{words} word{words !== 1 ? "s" : ""}</span>
      <span>|</span>
      <span>{chars} character{chars !== 1 ? "s" : ""}</span>
    </div>
  );
}
