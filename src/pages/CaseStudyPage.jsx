import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { caseStudies } from '../data/siteData';
import Seo from '../components/Seo';

const CaseStudyPage = () => {
  const { slug } = useParams();
  
  const caseStudy = caseStudies.find(cs => cs.slug === slug);

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Case Study Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">The case study you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${caseStudy.title} | St. Catharines Digital`}
        description={`${caseStudy.clientOverview} ${caseStudy.challenge}`.slice(0, 155)}
        path={`/case-studies/${caseStudy.slug}`}
        type="article"
      />
      <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">&larr; Back to Home</Link>
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">
          {caseStudy.title}
        </h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {caseStudy.clientOverview}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {caseStudy.challenge}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {caseStudy.solution}
            </p>
          </section>

          <section className="bg-blue-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">The Results</h2>
            <p className="text-lg text-blue-800 leading-relaxed font-medium">
              {caseStudy.results}
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Testimonial</h2>
            <blockquote className="italic text-xl text-gray-600 border-l-4 border-blue-600 pl-4 py-2">
              "{caseStudy.testimonial}"
            </blockquote>
          </section>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for similar results?</h3>
          <Link to="/#contact" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-md font-bold hover:bg-blue-700 transition shadow-lg">
            Get a Free Website Audit
          </Link>
        </div>
        </div>
      </div>
    </>
  );
};

export default CaseStudyPage;
