import { FileTextIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No documents yet",
  description = "Create your first document to get started.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground gap-3">
      <FileTextIcon className="w-12 h-12 opacity-30" />
      <p className="text-lg font-medium text-gray-600">{title}</p>
      <p className="text-sm text-gray-400 max-w-xs">{description}</p>
    </div>
  );
}
