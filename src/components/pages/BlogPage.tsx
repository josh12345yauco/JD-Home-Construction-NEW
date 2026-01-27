import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { BlogPosts } from '@/entities';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPosts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const result = await BaseCrudService.getAll<BlogPosts>('blogposts');
      const sortedPosts = result.items.sort((a, b) => {
        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return dateB - dateA;
      });
      setBlogPosts(sortedPosts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-8 pt-32 pb-24">
        <motion.div className="text-center max-w-4xl mx-auto" {...fadeInUp}>
          <h1 className="font-heading text-6xl lg:text-7xl text-secondary mb-6">
            Our Blog
          </h1>
          <p className="font-paragraph text-xl text-foreground">
            Tips, guides, and insights for homeowners planning their next construction project.
          </p>
        </motion.div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="w-full pb-24">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div {...fadeInUp}>
              <Link to={`/blog/${featuredPost._id}`}>
                <Card className="bg-background border border-medium-grey/30 rounded-xl hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {featuredPost.mainImage && (
                      <div className="overflow-hidden h-full min-h-[400px]">
                        <Image
                          src={featuredPost.mainImage}
                          alt={featuredPost.title || 'Featured post'}
                          width={800}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-12 flex flex-col justify-center">
                      <div className="inline-block px-4 py-2 bg-primary text-primary-foreground font-heading text-sm rounded mb-4 w-fit">
                        Featured
                      </div>
                      {featuredPost.category && (
                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-heading text-xs rounded mb-4 w-fit">
                          {featuredPost.category}
                        </div>
                      )}
                      <h2 className="font-heading text-4xl text-secondary mb-4 line-clamp-2">
                        {featuredPost.title}
                      </h2>
                      <p className="font-paragraph text-lg text-foreground mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          {featuredPost.author && (
                            <div className="font-paragraph text-sm text-foreground/70">
                              By {featuredPost.author}
                            </div>
                          )}
                          {featuredPost.publishDate && (
                            <div className="font-paragraph text-sm text-foreground/70">
                              {new Date(featuredPost.publishDate).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-primary font-heading">
                          <span>Read More</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="w-full pb-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
            {isLoading ? null : regularPosts.length > 0 ? (
              regularPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post._id}`}>
                    <Card className="h-full bg-background border border-medium-grey/30 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                      {post.mainImage && (
                        <div className="overflow-hidden">
                          <Image
                            src={post.mainImage}
                            alt={post.title || 'Blog post'}
                            width={400}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        {post.category && (
                          <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-heading text-xs rounded mb-3">
                            {post.category}
                          </div>
                        )}
                        <h3 className="font-heading text-xl text-secondary mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="font-paragraph text-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            {post.author && (
                              <span className="font-paragraph text-sm text-foreground/70">
                                {post.author}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-primary font-heading text-sm">
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : !isLoading && blogPosts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="font-paragraph text-foreground">No blog posts available at the moment.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
