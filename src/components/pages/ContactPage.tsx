import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function ContactPage() {
  useEffect(() => {
    // Load Tally embed script
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).Tally) {
        (window as any).Tally.loadEmbeds();
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-8 pt-32 pb-24">
        <motion.div className="text-center max-w-4xl mx-auto" {...fadeInUp}>
          <h1 className="font-heading text-6xl lg:text-7xl text-secondary mb-6">
            Contact a Top Philadelphia General Contractor Today
          </h1>
        </motion.div>
      </section>
      {/* Contact Info Cards */}
      <section className="w-full pb-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-background border border-medium-grey/30 rounded-xl text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl text-secondary mb-2">Phone</h3>
                  <a href="tel:+19085551234" className="font-paragraph text-foreground hover:text-primary transition-colors">267-804-4120</a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-background border border-medium-grey/30 rounded-xl text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl text-secondary mb-2">Email</h3>
                  <a href="mailto:JDhomellc@yahoo.com" className="font-paragraph text-foreground hover:text-primary transition-colors">
                    JDhomellc@yahoo.com
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-background border border-medium-grey/30 rounded-xl text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl text-secondary mb-2">Service Area</h3>
                  <p className="font-paragraph text-foreground">Philadelphia, P.A</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-background border border-medium-grey/30 rounded-xl text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl text-secondary mb-2">Hours</h3>
                  <p className="font-paragraph text-foreground">Mon-Fri: 7am-6pm</p>
                  <p className="font-paragraph text-foreground text-sm">Sat: 8am-4pm</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Contact Form */}
      <section className="w-full bg-light-grey py-24">
        <div className="max-w-[56rem] mx-auto px-8">
          <motion.div className="text-center mb-12" {...fadeInUp}>
            <h2 className="font-heading text-2xl text-secondary mb-6">
              Ready to start your next home renovation, deck build, or custom construction project? Contact JD Home Construction to schedule a consultation with Philadelphia's leading builders and carpenters.
            </h2>
          </motion.div>

          <motion.div {...fadeInUp}>
            <Card className="bg-background border border-medium-grey/30 rounded-xl shadow-lg">
              <CardContent className="p-8">
                <iframe
                  data-tally-src="https://tally.so/embed/jaBJ01?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                  loading="lazy"
                  width="100%"
                  height="1236"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="JD Home Construction - Request a Quote"
                  style={{ border: 'none' }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      {/* Service Areas */}
      <section className="w-full py-24">

      </section>
      <Footer />
    </div>
  );
}
