import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import serviceAreas from '@/data/service-areas.json';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function ServiceAreasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-secondary pt-32 pb-20">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="text-center max-w-4xl mx-auto" {...fadeInUp}>
            <h1 className="font-heading text-6xl lg:text-7xl text-white mb-6">
              Service Areas
            </h1>
            <p className="font-paragraph text-xl text-white/85">
              Trusted general contracting across Greater Philadelphia and Bucks County
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map-Like Grid */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="font-heading text-5xl text-secondary mb-4">
              Where We Work
            </h2>
            <p className="font-paragraph text-lg text-foreground max-w-2xl mx-auto">
              Over a decade of premium residential construction and renovation across six core service regions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceAreas.map((area, index) => (
              <motion.div
                key={area.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/areas/${area.slug}`}>
                  <Card className="h-full bg-background border border-medium-grey/30 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <MapPin className="w-7 h-7 text-primary" />
                      </div>

                      <h3 className="font-heading text-2xl text-secondary mb-4">
                        {area.name}
                      </h3>

                      <div className="mb-5">
                        <p className="font-heading text-sm text-primary mb-2 uppercase tracking-wide">
                          Neighborhoods
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {area.neighborhoodsServed.slice(0, 4).map((neighborhood) => (
                            <span
                              key={neighborhood}
                              className="font-paragraph text-sm text-foreground bg-light-grey px-3 py-1 rounded-full"
                            >
                              {neighborhood}
                            </span>
                          ))}
                          {area.neighborhoodsServed.length > 4 && (
                            <span className="font-paragraph text-sm text-primary px-3 py-1">
                              +{area.neighborhoodsServed.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="font-paragraph text-foreground/70 text-sm mb-6">
                        {area.commonProjects.length} common project types
                      </p>

                      <div className="flex items-center gap-2 text-primary font-heading">
                        <span>View Area Details</span>
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

      {/* Bottom CTA */}
      <section className="w-full bg-light-grey py-20">
        <div className="max-w-[100rem] mx-auto px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-heading text-4xl text-secondary mb-4">
              Don't See Your Area?
            </h2>
            <p className="font-paragraph text-lg text-foreground mb-8 max-w-2xl mx-auto">
              We likely serve it too — our team covers the Greater Philadelphia metro area and beyond.
              Contact us to discuss your project location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base px-8 h-12 rounded-lg"
              >
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-heading text-base px-8 h-12 rounded-lg"
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

      <Footer />
    </div>
  );
}
