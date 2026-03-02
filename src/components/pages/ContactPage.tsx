import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Image } from '@/components/ui/image';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    projectType: '',
    timeline: '',
    budget: '',
    details: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Send email notification to progresomarketingllc@gmail.com
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'progresomarketingllc@gmail.com',
          subject: `New Contact Form Submission from ${formData.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Zip Code:</strong> ${formData.zipCode}</p>
            <p><strong>Project Type:</strong> ${formData.projectType}</p>
            <p><strong>Timeline:</strong> ${formData.timeline}</p>
            <p><strong>Budget:</strong> ${formData.budget}</p>
            <p><strong>Project Details:</strong> ${formData.details}</p>
            ${uploadedImage ? `<p><strong>Image:</strong> <img src="${uploadedImage}" style="max-width: 300px; margin-top: 10px;" /></p>` : ''}
          `
        })
      });

      if (response.ok) {
        setSubmitMessage('Thank you! Your submission has been received. We\'ll be in touch within 1 business day.');
        setFormData({ name: '', email: '', phone: '', zipCode: '', projectType: '', timeline: '', budget: '', details: '' });
        setUploadedImage(null);
      } else {
        const errorData = await response.json();
        setSubmitMessage('There was an error submitting your form. Please try again or call us directly.');
        console.error('Form submission error:', errorData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage('There was an error submitting your form. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitMessage && (
                    <div className={`p-4 rounded-lg text-center font-paragraph ${submitMessage.includes('error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {submitMessage}
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-heading text-secondary mb-2">Name *</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="h-12 rounded-lg border-medium-grey/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-secondary mb-2">Email *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
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
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="h-12 rounded-lg border-medium-grey/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-secondary mb-2">Zip Code *</label>
                      <Input
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="07090"
                        className="h-12 rounded-lg border-medium-grey/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-heading text-secondary mb-2">Project Type *</label>
                      <Select value={formData.projectType} onValueChange={(value) => handleSelectChange('projectType', value)} required>
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
                      <Select value={formData.timeline} onValueChange={(value) => handleSelectChange('timeline', value)} required>
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
                    <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)} required>
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
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      placeholder="Tell us about your project, what you're looking to accomplish, any specific requirements..."
                      rows={6}
                      className="rounded-lg border-medium-grey/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-heading text-secondary mb-2">Upload Project Image (Optional)</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-heading file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                      />
                    </div>
                    {uploadedImage && (
                      <div className="mt-4">
                        <p className="font-heading text-secondary mb-2">Image Preview:</p>
                        <Image src={uploadedImage} alt="Project preview" className="max-w-xs rounded-lg border border-medium-grey/30" />
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base h-14 rounded-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request My Quote'}
                  </Button>

                  <a href="tel:267-804-4120" className="md:hidden block">
                    <Button
                      type="button"
                      size="lg"
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading text-base h-14 rounded-lg"
                    >
                      Call Now
                    </Button>
                  </a>

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
