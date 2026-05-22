import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import blogPosts from '@/data/blog-posts.json';

interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  publishDate: string;
  readTime: string;
  heroImage: string;
  excerpt: string;
  content: string;
  relatedServices: string[];
  relatedAreas: string[];
  faqs: { question: string; answer: string }[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const categories = ['All', 'Cost Guides', 'How-To', 'Local Insights', 'Tips'];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const posts = blogPosts as BlogPost[];

  const filteredPosts = useMemo(
    () =>
      activeCategory === 'All'
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [activeCategory, posts]
  );

  return (
    <div className="min-h-screen bg-background font-paragraph selection:bg-primary selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-secondary pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('/images/philadelphia-remodeling%20(1).avif')` }} />
        <div className="relative z-10 max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-6">
              <span className="h-[2px] w-12 bg-accent-orange" />
              <span className="font-heading text-sm tracking-widest uppercase text-accent-orange font-bold">
                JD Home Blog
              </span>
              <span className="h-[2px] w-12 bg-accent-orange" />
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-heading text-5xl lg:text-7xl text-white mb-6">
              Construction Insights &amp; Guides
            </motion.h1>

            <motion.p variants={fadeInUp} className="font-paragraph text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Expert advice on home renovation, construction costs, and project planning from Philadelphia's trusted contractor.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="w-full bg-background border-b border-medium-grey/20 sticky top-[72px] z-30">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-5">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-heading text-sm tracking-wide transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-light-grey text-secondary hover:bg-medium-grey/30 border border-medium-grey/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="w-full py-20 bg-light-grey">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {filteredPosts.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.slug}
                  variants={fadeInUp}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-medium-grey/10 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Card Image */}
                  <Link to={`/blog/${post.slug}`} className="block relative h-56 overflow-hidden">
                    <Image
                      src={post.heroImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      originWidth={800}
                      originHeight={450}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-accent-orange text-secondary text-xs font-heading font-bold uppercase tracking-wider rounded-full">
                      {post.category}
                    </span>
                  </Link>

                  {/* Card Content */}
                  <div className="p-6">
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="font-heading text-xl text-secondary mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="font-paragraph text-foreground/70 text-sm leading-relaxed mb-5 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-medium-grey/15">
                      <div className="flex items-center gap-4 text-foreground/50">
                        <span className="flex items-center gap-1.5 text-xs font-paragraph">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.publishDate)}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-paragraph">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-primary font-heading text-xs font-bold uppercase tracking-wider hover:text-accent-orange transition-colors flex items-center gap-1"
                      >
                        Read
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="font-heading text-2xl text-secondary mb-4">No posts found</p>
              <p className="font-paragraph text-foreground/60 mb-8">
                No articles match the selected category. Try selecting a different filter.
              </p>
              <Button
                onClick={() => setActiveCategory('All')}
                className="bg-primary hover:bg-primary/90 text-white font-heading rounded-full px-8"
              >
                View All Posts
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('/images/philadelphia-remodeling%20(1).avif')` }} />
        <div className="relative z-10 max-w-[100rem] mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl lg:text-6xl text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="font-paragraph text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get a free estimate from Philadelphia's most trusted general contractor. Clear pricing, honest timelines, quality craftsmanship.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button asChild size="lg" className="bg-accent-orange hover:bg-accent-orange/90 text-secondary font-heading text-lg px-10 h-16 rounded-full shadow-lg shadow-accent-orange/20 transition-all hover:scale-105">
                <Link to="/contact">Request a Free Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-secondary font-heading text-lg px-10 h-16 rounded-full transition-all bg-transparent">
                <Link to="/projects">View Our Work</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
