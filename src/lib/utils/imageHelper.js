// Utility function to generate high-quality SVG placeholders for missing/broken ticket images.

const generateSvgPlaceholder = (type) => {
  const t = type?.toLowerCase() || 'default';
  let iconPath = '';
  let gradientStr = '';

  if (t === 'bus') {
    gradientStr = '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e293b" /><stop offset="100%" stop-color="#0f172a" /></linearGradient>';
    iconPath = '<path d="M8 6v6M15 6v6M8 22h8c2.2 0 4-1.8 4-4v-8.5c0-1.5-1.1-2.8-2.6-3.1L16 6c-1-1.3-2.6-2-4-2h0c-1.4 0-3 .7-4 2l-1.4.4C5.1 6.7 4 8 4 9.5V18c0 2.2 1.8 4 4 4Z" /><path d="M6 10h12" /><path d="M9 18h.01" /><path d="M15 18h.01" />';
  } else if (t === 'plane' || t === 'flight') {
    gradientStr = '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a" /><stop offset="100%" stop-color="#082f49" /></linearGradient>';
    iconPath = '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-3.5 3.5-2.2-.6c-.4-.1-.8.1-1 .5L2 17l4.5 2.5L9 24l.6-.3c.4-.2.6-.6.5-1l-.6-2.2L13 17l5 6 1.2-.7c.4-.3.7-.7.6-1.2Z" />';
  } else if (t === 'train') {
    gradientStr = '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e1b4b" /><stop offset="100%" stop-color="#312e81" /></linearGradient>';
    iconPath = '<rect width="16" height="16" x="4" y="3" rx="2" /><path d="M4 11h16" /><path d="M12 3v8" /><path d="M8 19l-2 3" /><path d="M18 22l-2-3" /><path d="M8 15h0" /><path d="M16 15h0" />';
  } else if (t === 'ferry' || t === 'ship' || t === 'boat') {
    gradientStr = '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0c1445" /><stop offset="100%" stop-color="#164e63" /></linearGradient>';
    // Ship icon
    iconPath = '<path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1" /><path d="M4 14h16l-2.5-8H6.5L4 14z" /><path d="M12 6V2" />';
  } else if (t === 'car' || t === 'taxi' || t === 'cab') {
    gradientStr = '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1c1917" /><stop offset="100%" stop-color="#292524" /></linearGradient>';
    iconPath = '<path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2Z" /><path d="M7 6h10l-1-3H8L7 6Z" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />';
  } else {
    gradientStr = '<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#020617" /><stop offset="100%" stop-color="#1e293b" /></linearGradient>';
    iconPath = '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />';
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>${gradientStr}</defs>
      <rect width="800" height="600" fill="url(#g)" />
      <g stroke="#38bdf8" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(360, 260) scale(4)">
        ${iconPath}
      </g>
    </svg>
  `.trim().replace(/\s+/g, ' ');

  // Convert to Base64 data URI
  const base64 = typeof window === 'undefined'
    ? Buffer.from(svg).toString('base64')
    : btoa(svg);
    
  return `data:image/svg+xml;base64,${base64}`;
};

/**
 * Validates a ticket imageUrl and returns it if valid,
 * otherwise returns a transport-specific SVG placeholder.
 */
export const getValidImageUrl = (ticket) => {
  const url = ticket?.image;
  // If no URL, empty string, or not a string — use SVG
  if (!url || typeof url !== "string" || url.trim() === "") {
    return generateSvgPlaceholder(ticket?.type);
  }
  // If URL is suspiciously short or doesn't start with http(s) or data: — use SVG
  if (!url.startsWith("http") && !url.startsWith("data:") && !url.startsWith("/")) {
    return generateSvgPlaceholder(ticket?.type);
  }
  return url;
};

export { generateSvgPlaceholder };
