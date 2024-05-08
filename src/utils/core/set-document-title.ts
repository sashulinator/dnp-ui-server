export function setDocumentTitle(parts: string[], delimeter = ' | '): void {
  document.title = parts.join(delimeter)
}
