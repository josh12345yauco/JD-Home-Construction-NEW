import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import serviceAreas from '@/data/service-areas.json';
import servicesData from '@/data/services.json';
import { serviceUrl } from '@/lib/service-links';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function ServiceAreaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const area = serviceAreas.find((a) => a.slug === slug);

  if (!area) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[100rem] mx-auto px-8 py-32 text-center">
          <h1 className="font-heading text-4xl text-secondary mb-4">Area Not Found</h1>
          <p className="font-paragraph text-foreground mb-8">
            The service area you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/areas">View All Service Areas</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedServices = servicesData.filter((s) =>
    area.relatedServices.includes(s._id)
  );

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'JD Home Construction',
    description: area.metaDescription,
    telephone: '+1-267-804-4120',
    email: 'JDhomellc@yahoo.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Philadelphia',
      addressRegion: 'PA',
      addressCountry: 'US'
    },
    areaServed: area.neighborhoodsServed.map((n) => ({
      '@type': 'Place',
      name: n
    })),
    url: `https://jdhomeconstruction.com/areas/${area.slug}`
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: area.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jdhomeconstruction.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Service Areas',
        item: 'https://jdhomeconstruction.com/areas'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: area.name,
        item: `https://jdhomeconstruction.com/areas/${area.slug}`
      }
    ]
  };

  useEffect(() => {
    if (!area) return;

    document.title = area.metaTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', area.metaDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = area.metaDescription;
      document.head.appendChild(meta);
    }

    const schemas = [localBusinessSchema, faqSchema, breadcrumbSchema];
    const scriptElements: HTMLScriptElement[] = [];

    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      scriptElements.push(script);
    });

    return () => {
      scriptElements.forEach((el) => el.remove());
    };
  }, [area]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <nav className="w-full max-w-[100rem] mx-auto px-8 pt-24 pb-2" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 font-paragraph text-sm text-foreground/60">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/areas" className="hover:text-primary transition-colors">Service Areas</Link>
          </li>
          <li>/</li>
          <li className="text-secondary font-heading">{area.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="w-full bg-secondary py-20">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="max-w-4xl" {...fadeInUp}>
            <h1 className="font-heading text-5xl lg:text-6xl text-white mb-6">
              {area.heroHeading}
            </h1>
            <p className="font-paragraph text-xl text-white/85 mb-8">
              {area.heroSubheading}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-white/90 text-secondary font-heading text-base px-8 h-12 rounded-lg"
              >
                <Link to="/contact">Get a Free Estimate</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-heading text-base px-8 h-12 rounded-lg"
              >
                <a href="tel:+12678044120">
                  <Phone className="w-5 h-5 mr-2" />
                  267-804-4120
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="w-full py-20">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="max-w-4xl">
            <motion.div {...fadeInUp}>
              <h2 className="font-heading text-4xl text-secondary mb-6">
                About Our Work in {area.name}
              </h2>
              <p className="font-paragraph text-lg text-foreground leading-relaxed">
                {area.introduction}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Common Projects */}
      <section className="w-full bg-light-grey py-20">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="font-heading text-5xl text-secondary mb-4">
              Common Projects
            </h2>
            <p className="font-paragraph text-lg text-foreground">
              What we build and renovate most in {area.name}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {area.commonProjects.map((project, index) => (
              <motion.div
                key={project}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              >
                <Card className="h-full bg-background border border-medium-grey/30 rounded-xl">
                  <CardContent className="p-6 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="font-paragraph text-foreground">{project}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods We Serve */}
      <section className="w-full py-20">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="font-heading text-5xl text-secondary mb-4">
              Neighborhoods We Serve
            </h2>
            <p className="font-paragraph text-lg text-foreground">
              Providing premium construction services throughout {area.name}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {area.neighborhoodsServed.map((neighborhood, index) => (
              <motion.div
                key={neighborhood}
                className="flex items-center gap-3 bg-light-grey rounded-xl px-5 py-4"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-paragraph text-secondary font-medium">
                  {neighborhood}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Facts */}
      <section className="w-full bg-secondary py-20">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="font-heading text-5xl text-white mb-4">
              By the Numbers
            </h2>
            <p className="font-paragraph text-lg text-white/80">
              Our track record in {area.name}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {area.localFacts.map((fact, index) => (
              <motion.div
                key={fact.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="font-heading text-4xl lg:text-5xl text-accent-orange mb-3">
                  {fact.value}
                </div>
                <div className="font-paragraph text-white/80 text-sm uppercase tracking-wide">
                  {fact.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="font-heading text-5xl text-secondary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-paragraph text-lg text-foreground">
              Common questions about our services in {area.name}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {area.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-background border border-medium-grey/30 rounded-xl">
                  <CardContent className="p-8">
                    <h3 className="font-heading text-xl text-secondary mb-3">
                      {faq.question}
                    </h3>
                    <p className="font-paragraph text-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="w-full bg-light-grey py-20">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="max-w-4xl mx-auto text-center" {...fadeInUp}>
            <div className="font-heading text-6xl text-primary/20 mb-4">"</div>
            <blockquote className="font-paragraph text-xl lg:text-2xl text-secondary leading-relaxed italic mb-8">
              {area.testimonial.quote}
            </blockquote>
            <div>
              <p className="font-heading text-lg text-secondary">
                {area.testimonial.name}
              </p>
              <p className="font-paragraph text-foreground/70 text-sm">
                {area.testimonial.projectType}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="w-full py-20">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="font-heading text-5xl text-secondary mb-4">
                Related Services
              </h2>
              <p className="font-paragraph text-lg text-foreground">
                Explore our services available in {area.name}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {relatedServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <a href={serviceUrl(service._id)}>
                    <Card className="h-full bg-background border border-medium-grey/30 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                      <CardContent className="p-6 text-center">
                        <h3 className="font-heading text-lg text-secondary mb-2">
                          {service.serviceName}
                        </h3>
                        <div className="flex items-center justify-center gap-1 text-primary font-heading text-sm">
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {area.relatedBlogSlugs.length > 0 && (
        <section className="w-full bg-light-grey py-20">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="font-heading text-5xl text-secondary mb-4">
                Related Articles
              </h2>
              <p className="font-paragraph text-lg text-foreground">
                Helpful guides and insights for {area.name} homeowners
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {area.relatedBlogSlugs.map((blogSlug, index) => {
                const title = blogSlug
                  .split('-')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ');

                return (
                  <motion.div
                    key={blogSlug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link to={`/blog/${blogSlug}`}>
                      <Card className="h-full bg-background border border-medium-grey/30 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                        <CardContent className="p-6">
                          <h3 className="font-heading text-lg text-secondary mb-2">
                            {title}
                          </h3>
                          <div className="flex items-center gap-1 text-primary font-heading text-sm">
                            <span>Read Article</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="w-full bg-primary py-20">
        <div className="max-w-[100rem] mx-auto px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-heading text-5xl text-primary-foreground mb-6">
              Request a Free Estimate in {area.name}
            </h2>
            <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Ready to start your project? Contact us today for a detailed,
              no-obligation estimate.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-background hover:bg-background/90 text-secondary font-heading text-base px-8 h-12 rounded-lg"
            >
              <Link to="/contact">Contact Us Today</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
