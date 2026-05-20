import React from 'react';
import { ServiceLandingPage } from '../../../components/ServiceLandingPage';

export default function HVACPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "name": "Niagara Climate Control",
    "areaServed": "St. Catharines, Niagara Region",
    "description": "Expert heating, ventilation, and air conditioning services in St. Catharines."
  };

  return (
    <ServiceLandingPage
      title="Professional HVAC Services in St. Catharines"
      description="Keep your home comfortable year-round with our expert heating and cooling services in the Niagara Region."
      schema={schema}
    >
      <section>
        <h2>Our HVAC Services</h2>
        <ul>
          <li>Furnace Repair & Maintenance</li>
          <li>Air Conditioning Installation</li>
          <li>Indoor Air Quality Solutions</li>
        </ul>
      </section>
      <section>
        <h2>Testimonials</h2>
        <p>[Testimonial placeholder - To be added by Darius]</p>
      </section>
    </ServiceLandingPage>
  );
}
