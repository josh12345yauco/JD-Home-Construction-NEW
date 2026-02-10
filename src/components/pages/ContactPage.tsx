import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-8 pt-32 pb-24">
        <motion.div className="text-center max-w-4xl mx-auto" {...fadeInUp}>
          <h1 className="font-heading text-6xl lg:text-7xl text-secondary mb-6">
            Get In Touch
          </h1>
          <p className="font-paragraph text-xl text-foreground">
            Ready to start your project? Fill out the form below and we'll get back to you within 1 business day.
          </p>
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
                  <a href="mailto:info@jdconstruction.com" className="font-paragraph text-foreground hover:text-primary transition-colors">
                    info@jdconstruction.com
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
                  <p className="font-paragraph text-foreground">Philadelphia | N.J</p>
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
            <h2 className="font-heading text-5xl text-secondary mb-4">Request Your Estimate</h2>
            <p className="font-paragraph text-lg text-foreground">
              Tell us about your project and we'll get back to you within 1 business day
            </p>
          </motion.div>

          <motion.div {...fadeInUp}>
            <Card className="bg-background border border-medium-grey/30 rounded-xl shadow-lg">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-heading text-secondary mb-2">Name *</label>
                      <Input
                        placeholder="Your full name"
                        className="h-12 rounded-lg border-medium-grey/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-secondary mb-2">Email *</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="h-12 rounded-lg border-medium-grey/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-heading text-secondary mb-2">Phone *</label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="h-12 rounded-lg border-medium-grey/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-secondary mb-2">Zip Code *</label>
                      <Input
                        placeholder="07090"
                        className="h-12 rounded-lg border-medium-grey/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-heading text-secondary mb-2">Project Type *</label>
                      <Select required>
                        <SelectTrigger className="h-12 rounded-lg border-medium-grey/30">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kitchen">Kitchen Remodel</SelectItem>
                          <SelectItem value="bathroom">Bathroom Remodel</SelectItem>
                          <SelectItem value="addition">Home Addition</SelectItem>
                          <SelectItem value="deck">Deck/Outdoor Living</SelectItem>
                          <SelectItem value="roofing">Roofing & Siding</SelectItem>
                          <SelectItem value="flooring">Flooring & Carpentry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block font-heading text-secondary mb-2">Timeline *</label>
                      <Select required>
                        <SelectTrigger className="h-12 rounded-lg border-medium-grey/30">
                          <SelectValue placeholder="When to start?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">As soon as possible</SelectItem>
                          <SelectItem value="1-3">1-3 months</SelectItem>
                          <SelectItem value="3-6">3-6 months</SelectItem>
                          <SelectItem value="6+">6+ months</SelectItem>
                          <SelectItem value="planning">Just planning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-heading text-secondary mb-2">Budget Range *</label>
                    <Select required>
                      <SelectTrigger className="h-12 rounded-lg border-medium-grey/30">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-10k">Under $10,000</SelectItem>
                        <SelectItem value="10-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50-100k">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100k+">$100,000+</SelectItem>
                        <SelectItem value="not-sure">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block font-heading text-secondary mb-2">Project Details *</label>
                    <Textarea
                      placeholder="Tell us about your project, what you're looking to accomplish, any specific requirements..."
                      rows={6}
                      className="rounded-lg border-medium-grey/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-heading text-secondary mb-2">Photos (Optional)</label>
                    <div className="border-2 border-dashed border-medium-grey/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <p className="font-paragraph text-foreground mb-2">Drop photos here or click to upload</p>
                      <p className="font-paragraph text-sm text-foreground/70">JPG, PNG up to 10MB each</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base h-14 rounded-lg"
                  >
                    Request My Quote
                  </Button>

                  <p className="text-center font-paragraph text-sm text-foreground/70">
                    * Required fields. We reply within 1 business day.
                  </p>
                </form>
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
