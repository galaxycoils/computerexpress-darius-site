export function canHydratePrerender(root, location) {
  const normalize = (path) => path.replace(/\/+$/, "") || "/";
  if (!root.hasChildNodes() || !root.dataset.prerenderRoute) return false;
  if (normalize(root.dataset.prerenderRoute) !== normalize(location.pathname))
    return false;
  // Static pages are built without reader filters or private URL parameters.
  const statefulRoutes = [
    "/search",
    "/news",
    "/events",
    "/contact",
    "/preferences",
  ];
  const pathname = normalize(location.pathname);
  if (
    location.search &&
    statefulRoutes.some(
      (route) =>
        pathname === route ||
        (route === "/news" && pathname.startsWith("/news/")),
    )
  )
    return false;
  return true;
}
