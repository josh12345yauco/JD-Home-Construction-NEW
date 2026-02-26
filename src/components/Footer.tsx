import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Services } from '@/entities';

export default function Footer() {
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      try {
        const result = await BaseCrudService.getAll<Services>('services');
        setServices(result.items || []);
      } catch (error) {
        console.error('Failed to load services:', error);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadServices();
  }, []);

  return (
    <footer className="w-full bg-secondary text-secondary-foreground">
      <div className="max-w-[100rem] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <Image
                src="https://static.wixstatic.com/media/dc69ab_ee8a367561b049528ed1bb3a1d9e7ec7~mv2.png"
                width={240}
                height={80}
                className="h-16 w-auto"
                originWidth={875}
                originHeight={602}
                alt="JD Construction Logo"
              />
            </Link>
            <p className="font-paragraph text-secondary-foreground/80 mb-6">Building quality homes and lasting relationships over a decade. Licensed, insured, and committed to excellence.</p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

            </div>
          </div>
          {/* Services */}
          <div>
            <h3 className="font-heading text-xl mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service._id}>
                  <Link to={`/services/${service._id}`} className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                    {service.serviceName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/projects" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link to="/faq" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-heading text-xl mb-6">Get in Touch</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground/70">Phone</p>
                  <a href="tel:+12678044120" className="font-paragraph text-secondary-foreground hover:text-primary transition-colors">
                    267-804-4120
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground/70">Email</p>
                  <a href="mailto:JDhomellc@yahoo.com" className="font-paragraph text-secondary-foreground hover:text-primary transition-colors">
                    JDhomellc@yahoo.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground/70">Address</p>
                  <p className="font-paragraph text-secondary-foreground">
                    Philadelphia, PA
                  </p>
                </div>
              </div>
            </div>
            <Button 
              asChild 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link to="/contact">Send Message</Link>
            </Button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-secondary-foreground/70">
              © {new Date().getFullYear()} JD Construction. All rights reserved. License PA120312
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="font-paragraph text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="font-paragraph text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
