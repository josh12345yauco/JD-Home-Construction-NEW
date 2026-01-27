import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="w-full bg-secondary text-secondary-foreground">
      <div className="max-w-[100rem] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="font-heading text-2xl mb-6">
              JD <span className="text-primary">Construction</span>
            </div>
            <p className="font-paragraph text-secondary-foreground/80 mb-6">
              Building quality homes and lasting relationships since 2008. Licensed, insured, and committed to excellence.
            </p>
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
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading text-xl mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Kitchen Remodeling
                </Link>
              </li>
              <li>
                <Link to="/services" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Bathroom Remodeling
                </Link>
              </li>
              <li>
                <Link to="/services" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Home Additions
                </Link>
              </li>
              <li>
                <Link to="/services" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Decks & Outdoor Living
                </Link>
              </li>
              <li>
                <Link to="/services" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Roofing & Siding
                </Link>
              </li>
              <li>
                <Link to="/services" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Flooring & Carpentry
                </Link>
              </li>
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
                <Link to="/blog" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  Blog
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
            <h3 className="font-heading text-xl mb-6">Get In Touch</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href="tel:+19085551234" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  (908) 555-1234
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href="mailto:info@jdconstruction.com" className="font-paragraph text-secondary-foreground/80 hover:text-primary transition-colors">
                  info@jdconstruction.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-paragraph text-secondary-foreground/80">
                  Serving Central NJ
                </span>
              </li>
            </ul>

            <div>
              <h4 className="font-heading text-base mb-3">Newsletter</h4>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50 h-11 rounded-lg"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-11 rounded-lg flex-shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-secondary-foreground/70">
              © {new Date().getFullYear()} JD Construction. All rights reserved. License #13VH12345600
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
