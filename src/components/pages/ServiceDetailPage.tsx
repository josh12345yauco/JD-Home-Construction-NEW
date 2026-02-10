import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Services, Projects } from '@/entities';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Services | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Projects[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    try {
      const serviceData = await BaseCrudService.getById<Services>('services', id!);
      setService(serviceData);

      const projectsData = await BaseCrudService.getAll<Projects>('projects', {}, { limit: 3 });
      setRelatedProjects(projectsData.items);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[100rem] mx-auto px-8 py-32 text-center">
          <h1 className="font-heading text-4xl text-secondary mb-4">Service Not Found</h1>
          <p className="font-paragraph text-foreground mb-8">The service you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const processSteps = service.processSteps?.split('\n').filter(step => step.trim()) || [];
  const benefits = service.benefits?.split('\n').filter(benefit => benefit.trim()) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-8 pt-32 pb-16">
        <motion.div {...fadeInUp}>
          <h1 className="font-heading text-6xl lg:text-7xl text-secondary mb-6">
            {service.serviceName}
          </h1>
          <p className="font-paragraph text-xl text-foreground max-w-3xl">
            {service.shortDescription}
          </p>
        </motion.div>
      </section>
      {/* Service Image */}
      {service.serviceImage && (
        <section className="w-full max-w-[100rem] mx-auto px-8 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={service.serviceImage}
              alt={service.serviceName || 'Service'}
              width={1200}
              className="w-full h-[500px] object-cover rounded-xl"
            />
          </motion.div>
        </section>
      )}
      {/* Detailed Description */}
      <section className="w-full bg-light-grey py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div {...fadeInUp}>
              <h2 className="font-heading text-4xl text-secondary mb-6">What We Do</h2>
              <div className="font-paragraph text-lg text-foreground whitespace-pre-line">
                {service.detailedDescription}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-background border border-medium-grey/30 rounded-xl">
                <CardContent className="p-8">
                  <h3 className="font-heading text-2xl text-secondary mb-6">Quick Facts</h3>
                  <div className="space-y-4">
                    {service.timelineEstimate && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-heading text-secondary mb-1">Timeline</div>
                          <div className="font-paragraph text-foreground">{service.timelineEstimate}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 pt-8 border-t border-medium-grey/30">
                    <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading h-12 rounded-lg">
                      <Link to="/contact">Request a Quote</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Process Steps */}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="w-full bg-light-grey py-24">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="font-heading text-5xl text-secondary mb-4">Benefits</h2>
              <p className="font-paragraph text-lg text-foreground">Why choose this service</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="font-paragraph text-lg text-foreground flex-1">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="w-full py-24">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="font-heading text-5xl text-secondary mb-4">Related Projects</h2>
              <p className="font-paragraph text-lg text-foreground">See examples of our work</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/projects/${project._id}`}>
                    <Card className="h-full bg-background border border-medium-grey/30 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                      {project.beforeImage && (
                        <div className="overflow-hidden">
                          <Image
                            src={project.beforeImage}
                            alt={project.projectTitle || 'Project'}
                            width={400}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="font-heading text-xl text-secondary mb-2">{project.projectTitle}</h3>
                        <p className="font-paragraph text-sm text-foreground/70 mb-2">{project.location}</p>
                        <div className="flex items-center gap-2 text-primary font-heading text-sm">
                          <span>View Project</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* CTA Section */}
      <section className="w-full bg-primary py-20">
        <div className="max-w-[100rem] mx-auto px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-heading text-5xl text-primary-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and provide you with a detailed estimate.
            </p>
            <Button asChild size="lg" className="bg-background hover:bg-background/90 text-secondary font-heading text-base px-8 h-12 rounded-lg">
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
