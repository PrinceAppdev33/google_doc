/**
 * Exports editor HTML content as a downloadable .html file.
 */
export function exportAsHTML(content: string, filename = "document") {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${filename}</title>
  <style>body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; line-height: 1.6; }</style>
</head>
<body>${content}</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports plain text content as a downloadable .txt file.
 */
export function exportAsText(content: string, filename = "document") {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
