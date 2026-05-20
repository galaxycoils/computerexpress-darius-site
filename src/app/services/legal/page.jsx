import React from 'react';
import { ServiceLandingPage } from '../../../components/ServiceLandingPage';

export default function LegalPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "St. Catharines Legal Counsel",
    "areaServed": "St. Catharines, Niagara Region",
    "description": "Professional legal services for residents and businesses in St. Catharines and the Niagara region."
  };

  return (
    <ServiceLandingPage
      title="Trusted Legal Services in St. Catharines"
      description="Professional legal counsel and advocacy for individuals and businesses across the Niagara Region."
      schema={schema}
    >
      <section>
        <h2>Our Legal Practice Areas</h2>
        <ul>
          <li>Family Law</li>
          <li>Real Estate Law</li>
          <li>Business Law</li>
        </ul>
      </section>
      <section>
        <h2>Testimonials</h2>
        <p>[Testimonial placeholder - To be added by Darius]</p>
      </section>
    </ServiceLandingPage>
  );
}
