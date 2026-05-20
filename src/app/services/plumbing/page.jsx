import React from 'react';
import { ServiceLandingPage } from '../../../components/ServiceLandingPage';

export default function PlumbingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "PlumbingService",
    "name": "Expert Plumbing St. Catharines",
    "areaServed": "St. Catharines, Niagara Region",
    "description": "Professional plumbing services in St. Catharines, specializing in residential and commercial repairs."
  };

  return (
    <ServiceLandingPage
      title="Expert Plumbing Services in St. Catharines"
      description="Reliable, fast, and professional plumbing solutions for your home or business in the Niagara Region."
      schema={schema}
    >
      <section>
        <h2>Our Services</h2>
        <ul>
          <li>Emergency Drain Cleaning</li>
          <li>Pipe Repair and Installation</li>
          <li>Water Heater Services</li>
        </ul>
      </section>
      <section>
        <h2>Testimonials</h2>
        <p>[Testimonial placeholder - To be added by Darius]</p>
      </section>
    </ServiceLandingPage>
  );
}
