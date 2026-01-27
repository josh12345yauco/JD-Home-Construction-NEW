import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
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

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPosts | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPosts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const postData = await BaseCrudService.getById<BlogPosts>('blogposts', id!);
      setPost(postData);

      const allPosts = await BaseCrudService.getAll<BlogPosts>('blogposts', {}, { limit: 50 });
      const related = allPosts.items
        .filter(p => p._id !== id && p.category === postData?.category)
        .slice(0, 3);
      setRelatedPosts(related);
    } catch (error) {
      console.error('Error loading blog post:', error);
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

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[100rem] mx-auto px-8 py-32 text-center">
          <h1 className="font-heading text-4xl text-secondary mb-4">Post Not Found</h1>
          <p className="font-paragraph text-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">View All Posts</Link>
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
      <section className="w-full max-w-[100rem] mx-auto px-8 pt-32 pb-16">
        <motion.div className="max-w-4xl mx-auto" {...fadeInUp}>
          {post.category && (
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary font-heading text-sm rounded mb-6">
              {post.category}
            </div>
          )}
          <h1 className="font-heading text-5xl lg:text-6xl text-secondary mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-6 font-paragraph text-foreground">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <span>{post.author}</span>
              </div>
            )}
            {post.publishDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Featured Image */}
      {post.mainImage && (
        <section className="w-full max-w-[100rem] mx-auto px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={post.mainImage}
              alt={post.title || 'Blog post'}
              width={1200}
              className="w-full h-[500px] object-cover rounded-xl"
            />
          </motion.div>
        </section>
      )}

      {/* Post Content */}
      <section className="w-full pb-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="max-w-4xl mx-auto" {...fadeInUp}>
            {post.excerpt && (
              <div className="font-paragraph text-xl text-foreground mb-8 pb-8 border-b border-medium-grey/30">
                {post.excerpt}
              </div>
            )}
            {post.bodyContent && (
              <div className="font-paragraph text-lg text-foreground whitespace-pre-line leading-relaxed">
                {post.bodyContent}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="w-full bg-light-grey py-24">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="font-heading text-5xl text-secondary mb-4">Related Articles</h2>
              <p className="font-paragraph text-lg text-foreground">More from this category</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/blog/${relatedPost._id}`}>
                    <Card className="h-full bg-background border border-medium-grey/30 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                      {relatedPost.mainImage && (
                        <div className="overflow-hidden">
                          <Image
                            src={relatedPost.mainImage}
                            alt={relatedPost.title || 'Blog post'}
                            width={400}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        {relatedPost.category && (
                          <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-heading text-xs rounded mb-3">
                            {relatedPost.category}
                          </div>
                        )}
                        <h3 className="font-heading text-xl text-secondary mb-3 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center gap-2 text-primary font-heading text-sm">
                          <span>Read More</span>
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
              Ready to Start Your Project?
            </h2>
            <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Let's discuss your construction needs and create something amazing together.
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
