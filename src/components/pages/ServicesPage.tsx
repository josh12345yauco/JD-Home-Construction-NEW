import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Services } from '@/entities';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function ServicesPage() {
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const result = await BaseCrudService.getAll<Services>('services');
        setServices(result.items);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-8 pt-32 pb-24">
        <motion.div className="text-center max-w-4xl mx-auto" {...fadeInUp}>
          <h1 className="font-heading text-6xl lg:text-7xl text-secondary mb-6 editable-heading">
            Our Services
          </h1>
          <p className="font-paragraph text-xl text-foreground editable-paragraph">
            From concept to completion, we handle every detail of your construction project with precision and care.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="w-full pb-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!isLoading && services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/services/${service._id}`}>
                  <Card className="h-full bg-background border border-medium-grey/30 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <CardContent className="p-8">
                      {service.serviceImage && (
                        <div className="mb-6 overflow-hidden rounded-lg">
                          <Image
                            src={service.serviceImage}
                            alt={service.serviceName || 'Service'}
                            width={400}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="font-heading text-2xl text-secondary mb-4">{service.serviceName}</h3>
                      <p className="font-paragraph text-foreground mb-6">{service.shortDescription}</p>
                      <div className="flex items-center gap-2 text-primary font-heading">
                        <span>Learn More</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full bg-light-grey py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="font-heading text-5xl text-secondary mb-4">Why Choose JD Construction</h2>
            <p className="font-paragraph text-lg text-foreground">Quality, transparency, and craftsmanship in every project</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Licensed & Insured',
                description: 'Fully licensed P.A. contractor with comprehensive insurance coverage for your protection and peace of mind.'
              },
              {
                title: 'Transparent Pricing',
                description: 'Detailed estimates with no hidden fees. You\'ll know exactly what you\'re paying for before we start.'
              },
              {
                title: 'Warranty',
                description: 'All our work is backed by a comprehensive warranty. We stand behind our craftsmanship.'
              },
              {
                title: 'Quality Materials',
                description: 'We use premium materials from trusted suppliers to ensure your project lasts for decades.'
              },
              {
                title: 'Clean Worksites',
                description: 'Daily cleanup and respectful crews who treat your home with care throughout the project.'
              },
              {
                title: 'Clear Communication',
                description: 'Regular updates, responsive to questions, and always available when you need us.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-background border border-medium-grey/30 rounded-xl">
                  <CardContent className="p-8">
                    <h3 className="font-heading text-2xl text-secondary mb-4">{feature.title}</h3>
                    <p className="font-paragraph text-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
