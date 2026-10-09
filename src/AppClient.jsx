import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { buildChildRoutes } from "./routes/buildRoutes.jsx";
import { lazyPages } from "./routes/lazyPages.js";

/**
 * Browser entry. Same route table as App.jsx, resolved through the lazy page
 * map so each page is fetched only when its route is entered.
 *
 * The route list previously lived here as 33 hand-written <Route> elements,
 * duplicated verbatim from App.jsx.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {buildChildRoutes(lazyPages)}
      </Route>
    </Routes>
  );
}

export default function AppClient() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
