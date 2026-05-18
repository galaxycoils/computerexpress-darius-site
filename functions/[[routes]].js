export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Try static file first
  const response = await next();
  
  // If 404 and looks like a route (no file extension), serve index.html
  // Also explicitly ignore /assets/ to prevent hijacking of hashed files
  if (response.status === 404 && !path.startsWith('/assets/')) {
    const lastPart = path.split('/').pop();
    if (!lastPart.includes('.')) {
      url.pathname = '/index.html';
      return fetch(url.toString(), request);
    }
  }
  
  return response;
}
