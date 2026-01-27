import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-8 py-24">
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-heading text-9xl text-primary mb-6">404</div>
          <h1 className="font-heading text-5xl text-secondary mb-6">Page Not Found</h1>
          <p className="font-paragraph text-xl text-foreground mb-12">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading px-8 h-12 rounded-lg">
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-heading px-8 h-12 rounded-lg">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>

          <div className="mt-16 pt-16 border-t border-medium-grey/30">
            <h2 className="font-heading text-2xl text-secondary mb-6">Quick Links</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/services" className="font-paragraph text-foreground hover:text-primary transition-colors">
                Our Services
              </Link>
              <Link to="/projects" className="font-paragraph text-foreground hover:text-primary transition-colors">
                View Projects
              </Link>
              <Link to="/about" className="font-paragraph text-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/faq" className="font-paragraph text-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link to="/blog" className="font-paragraph text-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="font-paragraph text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
