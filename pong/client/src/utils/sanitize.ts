const escapeHTML = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeInput(str: string): string {
    if (typeof str !== "string") return "";
    // 1. Trim whitespace
    let clean = str.trim();
    // 2. Collapse multiple spaces
    clean = clean.replace(/\s+/g, " ");
    // 3. Remove control characters (null, bell, etc.)
    clean = clean.replace(/[\u0000-\u001F\u007F]/g, "");
    
    clean = escapeHTML(clean);
    
    return clean;
}

export default sanitizeInput