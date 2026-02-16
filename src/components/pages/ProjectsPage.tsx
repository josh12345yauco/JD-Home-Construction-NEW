import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const result = await BaseCrudService.getAll<Projects>('projects');
      setProjects(result.items);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['All', 'Kitchens', 'Baths', 'Exteriors', 'Additions', 'Decks'];
  
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-8 pt-32 pb-24">
        <motion.div className="text-center max-w-4xl mx-auto" {...fadeInUp}>
          <h1 className="font-heading text-6xl lg:text-7xl text-secondary mb-6">
            Our Projects
          </h1>
          <p className="font-paragraph text-xl text-foreground">
            Explore our portfolio of completed projects showcasing quality craftsmanship and attention to detail.
          </p>
        </motion.div>
      </section>
      {/* Filter Tabs */}
      <section className="w-full pb-12 hidden">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-3 rounded-lg font-heading transition-all ${
                  activeFilter === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-light-grey text-foreground hover:bg-medium-grey/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Instagram Feed */}
      <section className="w-full pb-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <iframe 
            src="https://widgets.sociablekit.com/instagram-feed/iframe/25655047" 
            frameBorder="0" 
            width="100%" 
            height="1000px"
            style={{ border: 'none' }}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
