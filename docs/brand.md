# Editorial identity

The selected identity is the SC monogram: interlocking serif initials inside a
square with a blue folded-page corner. The outlined Fraunces wordmark matches
the newspaper site's display typography. Ink, paper and blue match the site's
existing colour tokens.

The shared `BrandLogo` component appears in the masthead and footer. CSS swaps
the masthead artwork with the reader's theme, including the initial theme
applied before hydration. The footer always uses the reversed artwork. Explicit
image dimensions reserve space, and image alternative text names the home link.

Production assets retain the existing `/logo-horizontal.svg`, `/logo-news.svg`
and `/logo-mark.svg` URLs. The browser icon uses an opaque paper tile for toolbar
contrast; Apple devices receive a 180 px PNG. The web manifest also includes
192 px and 512 px PNG icons. The default social card is a 1200 × 630 WebP with
the news identity and “Local news. Clear sources.”

Downloadable, transparent SVG/PNG artwork and monochrome marks live in
`public/brand/`; their lettering is outlined, so imports need no font. See the
included README for dimensions, colours and usage. These are standalone files
that can be imported into Canva; no Canva design was created through a connector.
