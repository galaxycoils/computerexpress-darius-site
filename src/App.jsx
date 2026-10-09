import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { buildChildRoutes } from "./routes/buildRoutes.jsx";
import { staticPages } from "./routes/staticPages.js";

/**
 * Server/prerender entry. Routes come from src/routes/appRoutes.js and are
 * resolved through the statically imported page map, so renderToString can
 * render every route in one pass.
 *
 * The route list previously lived here as 33 hand-written <Route> elements,
 * duplicated verbatim in AppClient.jsx.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {buildChildRoutes(staticPages)}
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
