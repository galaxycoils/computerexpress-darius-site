import { Route } from 'react-router-dom'
import { appRoutes } from './appRoutes.js'

/**
 * Builds the child <Route> elements inside <Layout /> from the shared route
 * table, resolving each `page` key through the supplied component map.
 *
 * App.jsx passes the statically imported map (so renderToString can prerender
 * everything) and AppClient.jsx passes the lazy map (so the browser only
 * downloads the page it needs). Neither app lists routes any more.
 *
 * Throws when the table references a page that the map does not provide. That
 * turns a typo in a route name into a loud failure at render time instead of a
 * silently blank route — the failure mode the previous duplication allowed.
 */
export function buildChildRoutes(pages) {
  return appRoutes.map((route) => {
    const Component = pages[route.page]
    if (!Component) {
      throw new Error(
        `Route "${route.path}" references page "${route.page}", which is not registered in the component map.`,
      )
    }
    const key = route.index ? 'index' : route.path
    return route.index
      ? <Route key={key} index element={<Component />} />
      : <Route key={key} path={route.path} element={<Component />} />
  })
}
