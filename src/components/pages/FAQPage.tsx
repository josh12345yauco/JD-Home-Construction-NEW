import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { FAQs } from '@/entities';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQs[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const result = await BaseCrudService.getAll<FAQs>('faqs');
      const sortedFaqs = (result?.items || []).sort((a, b) => {
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        return 0;
      });
      setFaqs(sortedFaqs);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      setFaqs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)));
  const featuredFaqs = faqs.filter(faq => faq.isFeatured);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-8 pt-32 pb-24">
        <motion.div className="text-center max-w-4xl mx-auto" {...fadeInUp}>
          <h1 className="font-heading text-6xl lg:text-7xl text-secondary mb-6">
            Frequently Asked Questions
          </h1>
          <p className="font-paragraph text-xl text-foreground">
            Find answers to common questions about our construction process, timelines, and policies.
          </p>
        </motion.div>
      </section>

      {/* Featured FAQs */}
      {featuredFaqs.length > 0 && (
        <section className="w-full bg-light-grey py-24">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="font-heading text-4xl text-secondary mb-4">Most Asked Questions</h2>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-4">
              {featuredFaqs.map((faq, index) => (
                <motion.div
                  key={faq._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-background border border-medium-grey/30 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full text-left"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-heading text-xl text-secondary">{faq.question}</h3>
                          <ChevronDown
                            className={`w-6 h-6 text-primary flex-shrink-0 transition-transform ${
                              openIndex === index ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                        {openIndex === index && (
                          <div className="mt-4 font-paragraph text-foreground whitespace-pre-line">
                            {faq.answer}
                          </div>
                        )}
                      </CardContent>
                    </button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All FAQs by Category */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          {categories.length > 0 ? (
            categories.map((category, catIndex) => {
              const categoryFaqs = faqs.filter(faq => faq.category === category);
              
              return (
                <div key={category} className="mb-16 last:mb-0">
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="font-heading text-4xl text-secondary">{category}</h2>
                  </motion.div>

                  <div className="max-w-4xl space-y-4">
                    {categoryFaqs.map((faq, index) => {
                      const globalIndex = faqs.indexOf(faq);
                      return (
                        <motion.div
                          key={faq._id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.05 }}
                        >
                          <Card className="bg-background border border-medium-grey/30 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                              className="w-full text-left"
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                  <h3 className="font-heading text-lg text-secondary">{faq.question}</h3>
                                  <ChevronDown
                                    className={`w-6 h-6 text-primary flex-shrink-0 transition-transform ${
                                      openIndex === globalIndex ? 'rotate-180' : ''
                                    }`}
                                  />
                                </div>
                                {openIndex === globalIndex && (
                                  <div className="mt-4 font-paragraph text-foreground whitespace-pre-line">
                                    {faq.answer}
                                  </div>
                                )}
                              </CardContent>
                            </button>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="min-h-[400px]">
              {isLoading ? null : (
                <div className="text-center py-12">
                  <p className="font-paragraph text-foreground">No FAQs available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary py-20">
        <div className="max-w-[100rem] mx-auto px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-heading text-5xl text-primary-foreground mb-6">
              Still Have Questions?
            </h2>
            <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              We're here to help. Contact us and we'll answer any questions you have about your project.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
