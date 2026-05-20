import React from 'react';

// Reusable component template for industry-specific service pages
export const ServiceLandingPage = ({ title, description, schema, children }) => {
  return (
    <div className="service-landing-page">
      {/* Dynamic Metadata / SEO injection would happen here via context or parent */}
      <header className="hero">
        <h1>{title}</h1>
        <p>{description}</p>
        <button className="cta-primary">Book Your Free Audit</button>
      </header>
      
      <main className="content">
        {children}
      </main>

      {/* JSON-LD injection for schema support */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </div>
  );
};
