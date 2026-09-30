/**
 * Image URL Resolver for NOVA PANEL
 * 
 * Ensures that relative storage URLs (like /api/reader/pages/xyz) are always
 * resolved to the active backend server (http://localhost:5000/api/reader/pages/xyz)
 * so images load seamlessly across development, proxy, and production environments.
 */
export function resolveImageUrl(url) {
  if (!url) return '';

  // Return unchanged if already absolute, blob preview, or data-uri
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendOrigin = apiUrl.replace(/\/api\/?$/, '');

  // If already starts with /api/
  if (url.startsWith('/api/')) {
    return `${backendOrigin}${url}`;
  }

  // If it's a raw Google Drive fileId (no slashes)
  if (!url.includes('/')) {
    return `${backendOrigin}/api/reader/pages/${url}`;
  }

  return `${backendOrigin}/${url.replace(/^\/+/, '')}`;
}

export default resolveImageUrl;
