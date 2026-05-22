import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import blogPosts from '@/data/blog-posts.json';
import serviceAreas from '@/data/service-areas.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FAQ {
  question: string;
  answer: string;
}

interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  publishDate: string;
  readTime: string;
  heroImage: string;
  content: string;
  relatedServices: string[];
  relatedAreas: string[];
  faqs: FAQ[];
}

interface ServiceArea {
  slug: string;
  name: string;
}

// ---------------------------------------------------------------------------
// Animation variants (matches ServiceDetailPage)
// ---------------------------------------------------------------------------

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

// ---------------------------------------------------------------------------
// Simple Markdown Renderer
// ---------------------------------------------------------------------------

function parseInline(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function renderMarkdown(markdown: string): React.ReactNode[] {
  const blocks = markdown.split(/\n\n+/);
  const elements: React.ReactNode[] = [];
  let listBuffer: { ordered: boolean; items: string[] } | null = null;

  const flushList = () => {
    if (!listBuffer) return;
    const Tag = listBuffer.ordered ? 'ol' : 'ul';
    const listClass = listBuffer.ordered
      ? 'list-decimal pl-6 space-y-2 my-4 font-paragraph text-foreground text-lg leading-relaxed'
      : 'list-disc pl-6 space-y-2 my-4 font-paragraph text-foreground text-lg leading-relaxed';
    elements.push(
      <Tag key={`list-${elements.length}`} className={listClass}>
        {listBuffer.items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
        ))}
      </Tag>
    );
    listBuffer = null;
  };

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="font-heading text-2xl text-secondary mt-10 mb-4"
          dangerouslySetInnerHTML={{ __html: parseInline(trimmed.slice(4)) }}
        />
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="font-heading text-3xl text-secondary mt-12 mb-5"
          dangerouslySetInnerHTML={{ __html: parseInline(trimmed.slice(3)) }}
        />
      );
      continue;
    }

    const lines = trimmed.split('\n');
    const isBulletList = lines.every((l) => /^[-*]\s/.test(l.trim()));
    const isNumberedList = lines.every((l) => /^\d+\.\s/.test(l.trim()));

    if (isBulletList) {
      if (listBuffer && !listBuffer.ordered) {
        listBuffer.items.push(...lines.map((l) => l.replace(/^[-*]\s+/, '')));
      } else {
        flushList();
        listBuffer = { ordered: false, items: lines.map((l) => l.replace(/^[-*]\s+/, '')) };
      }
      continue;
    }

    if (isNumberedList) {
      if (listBuffer && listBuffer.ordered) {
        listBuffer.items.push(...lines.map((l) => l.replace(/^\d+\.\s+/, '')));
      } else {
        flushList();
        listBuffer = { ordered: true, items: lines.map((l) => l.replace(/^\d+\.\s+/, '')) };
      }
      continue;
    }

    flushList();
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="font-paragraph text-lg text-foreground leading-relaxed mb-6"
        dangerouslySetInnerHTML={{ __html: parseInline(trimmed) }}
      />
    );
  }

  flushList();
  return elements;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = useMemo(
    () => (blogPosts as BlogPost[]).find((p) => p.slug === slug) ?? null,
    [slug]
  );

  const relatedArticles = useMemo(() => {
    if (!post) return [];
    return (blogPosts as BlogPost[])
      .filter((p) => p.category === post.category && p.slug !== post.slug)
      .slice(0, 3);
  }, [post]);

  const areas = useMemo(() => {
    if (!post) return [];
    return (serviceAreas as ServiceArea[]).filter((a) =>
      post.relatedAreas.includes(a.slug)
    );
  }, [post]);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // -----------------------------------------------------------------------
  // JSON-LD Structured Data
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!post) return;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.publishDate,
      author: { '@type': 'Organization', name: 'JD Home Construction' },
      publisher: { '@type': 'Organization', name: 'JD Home Construction' },
      image: post.heroImage,
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: window.location.origin + '/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: window.location.href },
      ],
    };

    const scripts: HTMLScriptElement[] = [];

    const articleScript = document.createElement('script');
    articleScript.type = 'application/ld+json';
    articleScript.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(articleScript);
    scripts.push(articleScript);

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);
    scripts.push(breadcrumbScript);

    if (post.faqs?.length) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      };
      const faqScript = document.createElement('script');
      faqScript.type = 'application/ld+json';
      faqScript.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(faqScript);
      scripts.push(faqScript);
    }

    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [post]);

  // -----------------------------------------------------------------------
  // 404 State
  // -----------------------------------------------------------------------
  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[100rem] mx-auto px-8 py-32 text-center">
          <motion.div {...fadeInUp}>
            <h1 className="font-heading text-5xl text-secondary mb-4">Post Not Found</h1>
            <p className="font-paragraph text-lg text-foreground mb-8">
              The blog post you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading h-12 px-8 rounded-lg">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative w-full h-[50vh] min-h-[400px] lg:h-[60vh]">
        <Image
          src={post.heroImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/70" />
        <div className="relative z-10 flex flex-col justify-end h-full max-w-[100rem] mx-auto px-8 pb-12 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-primary text-primary-foreground font-heading text-sm px-4 py-1.5 rounded-full mb-5">
              {post.category}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-5 max-w-4xl leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-white/80 font-paragraph text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-[100rem] mx-auto px-8 py-5 border-b border-medium-grey/30">
        <ol className="flex flex-wrap items-center gap-1.5 font-paragraph text-sm text-foreground/60">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li><ChevronRight className="w-3.5 h-3.5" /></li>
          <li>
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </li>
          <li><ChevronRight className="w-3.5 h-3.5" /></li>
          <li className="text-secondary font-heading truncate max-w-[250px]">{post.title}</li>
        </ol>
      </nav>

      {/* Article body + sidebar */}
      <section className="max-w-[100rem] mx-auto px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main content */}
          <motion.article className="flex-1 max-w-3xl" {...fadeInUp}>
            {renderMarkdown(post.content)}
          </motion.article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-8">
            {/* Meta card */}
            <motion.div
              className="bg-light-grey rounded-xl p-6 border border-medium-grey/30 sticky top-28"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-heading text-lg text-secondary mb-4">About This Article</h3>
              <div className="space-y-3 font-paragraph text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{post.readTime}</span>
                </div>
                <div className="mt-2">
                  <span className="inline-block bg-secondary/10 text-secondary font-heading text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Related service areas */}
              {areas.length > 0 && (
                <div className="mt-6 pt-5 border-t border-medium-grey/30">
                  <h4 className="font-heading text-sm text-secondary mb-3">Related Service Areas</h4>
                  <ul className="space-y-2">
                    {areas.map((area) => (
                      <li key={area.slug}>
                        <Link
                          to={`/areas/${area.slug}`}
                          className="flex items-center gap-1.5 text-sm font-paragraph text-foreground hover:text-primary transition-colors group"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                          {area.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 pt-5 border-t border-medium-grey/30">
                <p className="font-paragraph text-sm text-foreground mb-3">
                  Ready to start your project?
                </p>
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading h-11 rounded-lg"
                >
                  <Link to="/contact">Request a Quote</Link>
                </Button>
              </div>
            </motion.div>
          </aside>
        </div>
      </section>

      {/* FAQ Section */}
      {post.faqs?.length > 0 && (
        <section className="w-full bg-light-grey py-20">
          <div className="max-w-3xl mx-auto px-8">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className="font-heading text-4xl text-secondary mb-3">Frequently Asked Questions</h2>
              <p className="font-paragraph text-lg text-foreground">
                Common questions about {post.title.toLowerCase()}
              </p>
            </motion.div>

            <div className="space-y-4">
              {post.faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-background rounded-xl border border-medium-grey/30 overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <button
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                  >
                    <h3 className="font-heading text-lg text-secondary">{faq.question}</h3>
                    <ChevronRight
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${
                        openFaq === index ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5">
                      <p className="font-paragraph text-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="w-full py-20">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className="font-heading text-4xl text-secondary mb-3">Related Articles</h2>
              <p className="font-paragraph text-lg text-foreground">
                More insights on {post.category.toLowerCase()}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/blog/${article.slug}`} className="group block h-full">
                    <div className="h-full bg-background border border-medium-grey/30 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      <div className="overflow-hidden">
                        <Image
                          src={article.heroImage}
                          alt={article.title}
                          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <span className="inline-block bg-secondary/10 text-secondary font-heading text-xs px-3 py-1 rounded-full mb-3">
                          {article.category}
                        </span>
                        <h3 className="font-heading text-xl text-secondary mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="font-paragraph text-sm text-foreground/70 mb-3 line-clamp-2">
                          {article.metaDescription}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-heading text-sm">
                          <span>Read More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="w-full bg-primary py-20">
        <div className="max-w-[100rem] mx-auto px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-heading text-5xl text-primary-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and provide you with a detailed estimate.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-background hover:bg-background/90 text-secondary font-heading text-base px-8 h-12 rounded-lg"
            >
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
