export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Try static file first
  const response = await next();
  
  // If 404 and looks like a route (no file extension), serve index.html
  if (response.status === 404) {
    const lastPart = path.split('/').pop();
    if (!lastPart.includes('.')) {
      url.pathname = '/index.html';
      return fetch(url.toString(), request);
    }
  }
  
  return response;
}
