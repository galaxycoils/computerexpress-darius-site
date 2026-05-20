import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "St. Catharines Digital",
  description: "Performance-first web design and SEO agency in St. Catharines.",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "St. Catharines Digital",
  "image": "https://stcatharinesdigital.pages.dev/og-card.png",
  "@id": "https://stcatharinesdigital.pages.dev/",
  "url": "https://stcatharinesdigital.pages.dev/",
  "telephone": "(365) 359-5973",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "St. Catharines",
    "addressLocality": "St. Catharines",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "priceRange": "$$$"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
