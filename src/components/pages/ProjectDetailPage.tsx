import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
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

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Projects | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Projects[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const projectData = await BaseCrudService.getById<Projects>('projects', id!);
      setProject(projectData);

      const allProjects = await BaseCrudService.getAll<Projects>('projects', {}, { limit: 50 });
      const related = (allProjects?.items || [])
        .filter(p => p._id !== id && p.category === projectData?.category)
        .slice(0, 3);
      setRelatedProjects(related);
    } catch (error) {
      console.error('Error loading project:', error);
      setProject(null);
      setRelatedProjects([]);
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

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[100rem] mx-auto px-8 py-32 text-center">
          <h1 className="font-heading text-4xl text-secondary mb-4">Project Not Found</h1>
          <p className="font-paragraph text-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-8 pt-32 pb-16">
        <motion.div {...fadeInUp}>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {project.category && (
              <span className="px-4 py-2 bg-primary/10 text-primary font-heading text-sm rounded">
                {project.category}
              </span>
            )}
            {project.beforeImage && project.afterImage && (
              <span className="px-4 py-2 bg-secondary/10 text-secondary font-heading text-sm rounded">
                Before/After Available
              </span>
            )}
          </div>
          <h1 className="font-heading text-6xl lg:text-7xl text-secondary mb-6">
            {project.projectTitle}
          </h1>
          <div className="flex flex-wrap gap-6 font-paragraph text-lg text-foreground">
            {project.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{project.location}</span>
              </div>
            )}
            {project.scopeOfWork && (
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                <span>{project.scopeOfWork}</span>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Before/After Images */}
      <section className="w-full max-w-[100rem] mx-auto px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {project.beforeImage && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute top-4 left-4 px-4 py-2 bg-secondary text-secondary-foreground font-heading text-sm rounded z-10">
                  Before
                </div>
                <Image
                  src={project.beforeImage}
                  alt={`${project.projectTitle} - Before`}
                  width={600}
                  className="w-full h-[500px] object-cover rounded-xl"
                />
              </div>
            </motion.div>
          )}
          {project.afterImage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute top-4 left-4 px-4 py-2 bg-primary text-primary-foreground font-heading text-sm rounded z-10">
                  After
                </div>
                <Image
                  src={project.afterImage}
                  alt={`${project.projectTitle} - After`}
                  width={600}
                  className="w-full h-[500px] object-cover rounded-xl"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Description */}
      {project.projectDescription && (
        <section className="w-full bg-light-grey py-24">
          <div className="max-w-[100rem] mx-auto px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div {...fadeInUp}>
                <h2 className="font-heading text-4xl text-secondary mb-6">Project Details</h2>
                <div className="font-paragraph text-lg text-foreground whitespace-pre-line">
                  {project.projectDescription}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Project Info Cards */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {project.category && (
              <motion.div {...fadeInUp}>
                <Card className="bg-background border border-medium-grey/30 rounded-xl">
                  <CardContent className="p-8 text-center">
                    <Tag className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-heading text-xl text-secondary mb-2">Category</h3>
                    <p className="font-paragraph text-foreground">{project.category}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {project.location && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-background border border-medium-grey/30 rounded-xl">
                  <CardContent className="p-8 text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-heading text-xl text-secondary mb-2">Location</h3>
                    <p className="font-paragraph text-foreground">{project.location}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {project.scopeOfWork && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-background border border-medium-grey/30 rounded-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="font-heading text-2xl text-primary">✓</span>
                    </div>
                    <h3 className="font-heading text-xl text-secondary mb-2">Scope</h3>
                    <p className="font-paragraph text-foreground">{project.scopeOfWork}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="w-full bg-light-grey py-24">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="font-heading text-5xl text-secondary mb-4">Related Projects</h2>
              <p className="font-paragraph text-lg text-foreground">More projects in this category</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedProjects.map((relatedProject, index) => (
                <motion.div
                  key={relatedProject._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/projects/${relatedProject._id}`}>
                    <Card className="h-full bg-background border border-medium-grey/30 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                      {relatedProject.beforeImage && (
                        <div className="overflow-hidden">
                          <Image
                            src={relatedProject.beforeImage}
                            alt={relatedProject.projectTitle || 'Project'}
                            width={400}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="font-heading text-xl text-secondary mb-2">{relatedProject.projectTitle}</h3>
                        <p className="font-paragraph text-sm text-foreground/70 mb-2">{relatedProject.location}</p>
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
              Ready for Your Own Transformation?
            </h2>
            <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and create something amazing together.
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
