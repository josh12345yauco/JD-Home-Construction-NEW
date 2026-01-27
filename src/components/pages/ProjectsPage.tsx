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
      <section className="w-full pb-12">
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

      {/* Projects Grid */}
      <section className="w-full pb-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
            {isLoading ? null : filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/projects/${project._id}`}>
                    <Card className="h-full bg-background border border-medium-grey/30 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                      <div className="relative overflow-hidden">
                        {project.beforeImage && (
                          <Image
                            src={project.beforeImage}
                            alt={project.projectTitle || 'Project'}
                            width={400}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        {project.beforeImage && project.afterImage && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground font-heading text-sm rounded">
                            Before/After
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-heading text-xl text-secondary mb-2">{project.projectTitle}</h3>
                        <p className="font-paragraph text-sm text-foreground/70 mb-2">{project.location}</p>
                        <p className="font-paragraph text-foreground mb-4">{project.scopeOfWork}</p>
                        <div className="flex items-center gap-2 text-primary font-heading">
                          <span>View Project</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="font-paragraph text-foreground">No projects found for this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
