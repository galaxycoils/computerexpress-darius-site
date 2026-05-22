export const services = [
  {
    icon: 'web',
    title: 'High-Performance Websites',
    description: 'Custom websites built to load fast, earn trust instantly, and guide visitors toward a clear next step. Every site is mobile-first, SEO-optimized, and designed to convert.',
    bullets: [
      'Custom design tailored to your brand and industry',
      'Mobile-first responsive (70% of local searches are on mobile)',
      'Technical SEO foundation with schema markup',
      'Conversion-optimized layout with clear CTAs',
    ]
  },
  {
    icon: 'search',
    title: 'Technical SEO',
    description: 'Search-ready architecture that helps Google understand, crawl, and rank your site. We fix what\'s broken and optimize what matters.',
    bullets: [
      'Site speed optimization (target: 90+ PageSpeed)',
      'Schema markup (LocalBusiness, Service, FAQ, Review)',
      'Core Web Vitals improvement (LCP, FID, CLS)',
      'XML sitemap, robots.txt, and crawl optimization',
    ]
  },
  {
    icon: 'map',
    title: 'Google Business Profile',
    description: 'Dominate Google Maps and local search. We optimize your GBP to rank #1 in the Local Pack and drive more calls, visits, and inquiries.',
    bullets: [
      'Complete GBP setup, verification, and optimization',
      'Keyword-optimized business description and services',
      'Review generation strategy and response system',
      'Weekly Google Posts and Q&A optimization',
    ]
  }
]

export const packages = [
  {
    name: 'Launch',
    price: '$1,500',
    period: 'one-time',
    ideal: 'For businesses that need a sharp, credible online presence fast.',
    features: [
      '1-5 page custom website',
      'Mobile-first responsive design',
      'Core on-page SEO setup',
      'Contact form with email notifications',
      'Google Business Profile setup',
      '30-day satisfaction guarantee',
    ],
    featured: false
  },
  {
    name: 'Growth',
    price: '$3,500',
    period: 'one-time',
    ideal: 'For teams that want stronger positioning, better search visibility, and more qualified leads.',
    features: [
      'Everything in Launch, plus:',
      'Technical SEO foundation',
      'Schema markup implementation',
      'Service area pages',
      'Analytics and conversion tracking',
      '3 months of SEO support',
      '30-day satisfaction guarantee',
    ],
    featured: true
  },
  {
    name: 'Local Authority',
    price: '$5,500',
    period: 'one-time',
    ideal: 'For service brands ready to dominate local search and maps in their market.',
    features: [
      'Everything in Growth, plus:',
      'Google Business Profile optimization',
      'Local SEO page structure',
      'Review generation workflow',
      'Monthly reporting and strategy',
      'Priority support',
      '30-day satisfaction guarantee',
    ],
    featured: false
  }
]

export const steps = [
  { title: 'Audit', desc: 'We analyze your current site, competitors, and local search landscape to identify the highest-leverage opportunities.' },
  { title: 'Strategy', desc: 'We map out the right information architecture, messaging, and local SEO approach for your specific market.' },
  { title: 'Build', desc: 'We design and develop your site with speed, SEO, and conversion best practices baked in from day one.' },
  { title: 'Launch', desc: 'We go live with tracking, search fundamentals, and a clear lead capture path. Then we optimize based on real data.' }
]

export const testimonials = [
  {
    text: 'We rebuilt Niagara Plumbing Solutions website from the ground up. Within 3 months they were ranking on page 1 for their main service area and phone calls doubled.',
    name: 'Dave Carter',
    role: 'Owner, Niagara Plumbing Solutions',
    initials: 'DC',
    image: '/images/client_plumber.webp',
    metric: '2.4x leads in 90 days'
  },
  {
    text: 'The team at St. Catharines Digital made a huge difference. Our old site looked generic — the new site actually positions us as a premium firm. Clients comment on how professional it is.',
    name: 'Sarah Jenkins',
    role: 'Managing Partner, St. Catharines Family Law',
    initials: 'SJ',
    image: '/images/client_lawyer.webp',
    metric: 'Premium positioning'
  },
  {
    text: 'They handled everything — custom web design, technical SEO, and Google Business Profile. Our map pack visibility went from nowhere to top 3 in St. Catharines.',
    name: 'Marcus Miller',
    role: 'Founder, Garden City HVAC',
    initials: 'MM',
    image: '/images/client_hvac.webp',
    metric: 'Top 3 map pack rank'
  },
  {
    text: 'Our new property management website looks incredible and integrates perfectly with our tenant portal. We\'ve seen a 40% increase in inquiries from quality tenants in just two months.',
    name: 'Jessica Thorne',
    role: 'Owner, Thorne Property Management',
    initials: 'JT',
    image: '/images/client_landlord.webp',
    metric: '40% increase in inquiries'
  }
]

export const faqItems = [
  {
    q: 'How long does a typical project take?',
    a: 'Most website projects launch within 2-4 weeks depending on scope. SEO work begins immediately but meaningful ranking improvements typically show within 60-90 days. We\'ll give you a clear timeline after the initial audit.'
  },
  {
    q: 'Do you work with businesses outside the local area?',
    a: 'Yes. While we specialize in local SEO and service businesses, we work with clients remotely across Canada and the US. The same principles apply — we just target your specific service areas.'
  },
  {
    q: 'What makes St. Catharines Digital different from other agencies?',
    a: 'We\'re based right here in St. Catharines and we specialize in service businesses. We use AI to move faster and keep costs down, but every decision is made by a human who understands your market. No bloated retainers, no vague deliverables. We focus on what matters: site quality, search readiness, and local presence.'
  },
  {
    q: 'Do you offer ongoing support after launch?',
    a: 'Yes. We offer maintenance retainers for updates, content changes, and ongoing SEO. But we also build sites you can manage yourself — your choice. We\'ll recommend what makes sense for your situation.'
  },
  {
    q: 'What do you need from me to get started?',
    a: 'Just your current website URL, a sense of what you want to improve, and your main service offerings. We handle the rest — strategy, design, copy, and technical setup. The first step is a free audit.'
  },
  {
    q: 'What if I\'m not happy with the result?',
    a: 'We offer a 30-day satisfaction guarantee on all packages. If you\'re not happy with the work, we\'ll keep revising until you are. We\'ve never had to use it — but it\'s there so you can commit with confidence.'
  }
]

export const portfolioItems = [
  {
    icon: 'web',
    title: 'Plumbing Company Website + Local SEO',
    desc: 'Full redesign with service area pages, review integration, and GBP optimization for a regional plumbing company.',
    tags: ['Web Design', 'Local SEO', 'GBP'],
    results: [
      { value: '3x', label: 'More leads' },
      { value: '#1', label: 'Local pack' },
      { value: '98', label: 'PageSpeed' }
    ]
  },
  {
    icon: 'search',
    title: 'Law Firm Technical SEO Overhaul',
    desc: 'Complete technical SEO cleanup, schema implementation, and content restructuring for a boutique law firm.',
    tags: ['Technical SEO', 'Schema', 'Content'],
    results: [
      { value: '5x', label: 'Organic traffic' },
      { value: '12', label: 'Page 1 ranks' },
      { value: '<2s', label: 'Avg. load' }
    ]
  }
]

export const stats = [
  { value: '28+', label: 'Local businesses helped' },
  { value: '98', label: 'Avg. PageSpeed' },
  { value: '3.5x', label: 'Lead increase' },
  { value: '<12h', label: 'Response time' }
]

export const trustItems = [
  'Premium positioning without agency fluff',
  'Search-ready structure from day one',
  'Built for local service businesses',
  'Clear calls to action and conversion flow'
]

export const guarantee = {
  title: '30-Day Satisfaction Guarantee',
  description: 'If you\'re not happy with our work, we\'ll keep revising until you are. Every package includes this guarantee — so you can commit with zero risk.'
}

export const caseStudies = [
  {
    slug: 'plumber-case-study',
    title: 'Niagara Plumbing Solutions',
    clientOverview: 'A local plumbing company struggling with online visibility.',
    challenge: 'Old website was slow, not mobile-friendly, and they were invisible on Google Maps.',
    solution: 'Full website redesign with service area pages and complete Google Business Profile optimization.',
    results: 'Ranked on page 1 for main service area. Phone calls doubled in 3 months.',
    testimonial: 'We rebuilt Niagara Plumbing Solutions website from the ground up. Within 3 months they were ranking on page 1 for their main service area and phone calls doubled. - Dave Carter'
  },
  {
    slug: 'hvac-case-study',
    title: 'Garden City HVAC',
    clientOverview: 'An established HVAC contractor needing to modernize their brand.',
    challenge: 'Generic website that didn\'t reflect the quality of their service. Poor local search rankings.',
    solution: 'Custom web design, technical SEO overhaul, and GBP review generation strategy.',
    results: 'Map pack visibility went from nowhere to top 3 in St. Catharines.',
    testimonial: 'They handled everything — custom web design, technical SEO, and Google Business Profile. Our map pack visibility went from nowhere to top 3 in St. Catharines. - Marcus Miller'
  },
  {
    slug: 'legal-case-study',
    title: 'St. Catharines Family Law',
    clientOverview: 'A boutique family law firm looking for premium positioning.',
    challenge: 'Website looked outdated and didn\'t attract the right type of high-value client.',
    solution: 'Professional redesign with high-quality imagery, clear messaging, and technical SEO structure.',
    results: 'Improved brand perception and an increase in inquiries from qualified prospects.',
    testimonial: 'The team at St. Catharines Digital made a huge difference. Our old site looked generic — the new site actually positions us as a premium firm. Clients comment on how professional it is. - Sarah Jenkins'
  },
  {
    slug: 'landlord-case-study',
    title: 'Thorne Property Management',
    clientOverview: 'A growing property management company needing to streamline operations and attract new tenants.',
    challenge: 'Their previous website lacked modern tenant portal integration and failed to rank for local property management searches.',
    solution: 'Built a new, conversion-optimized website with dedicated property galleries, seamless portal integration, and local SEO campaigns.',
    results: '40% increase in inquiries from prospective tenants and streamlined maintenance request flow.',
    testimonial: 'Our new property management website looks incredible and integrates perfectly with our tenant portal. We\'ve seen a 40% increase in inquiries from quality tenants in just two months. - Jessica Thorne'
  }
];
