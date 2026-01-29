import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Shield, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { TeamMembers } from '@/entities';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const result = await BaseCrudService.getAll<TeamMembers>('teammembers');
      setTeamMembers(result.items);
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-8 pt-32 pb-24">
        <motion.div className="text-center max-w-4xl mx-auto" {...fadeInUp}>
          <h1 className="font-heading text-6xl lg:text-7xl text-secondary mb-6">
            Building Excellence Since 2008
          </h1>
          <p className="font-paragraph text-xl text-foreground">
            We're a family-owned construction company dedicated to transforming houses into dream homes with quality craftsmanship and honest communication.
          </p>
        </motion.div>
      </section>
      {/* Our Story */}
      <section className="w-full bg-light-grey py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="font-heading text-5xl text-secondary mb-6">Our Story</h2>
              <div className="space-y-4 font-paragraph text-lg text-foreground">
                <p>
                  Welcome to JD Home Construction, based in the Port Richmond section of Philadelphia. We offer top-quality building services tailored to meet the needs of homeowners, investors, and businesses.
                </p>
                <p>
                  While we excel in carpentry and related services, please note that we do not provide plumbing, electrical, roofing, or HVAC services. However, we have established partnerships with trusted professionals in these fields and are happy to give referrals to ensure your project is seamless from start to finish.
                </p>
                <p className="font-heading text-xl text-secondary mt-6 mb-3">Areas We Service</p>
                <p>
                  JD Home Construction proudly serves the following Philadelphia neighborhoods:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Port Richmond</li>
                  <li>Fishtown</li>
                  <li>Fairmount</li>
                  <li>Northern Liberties</li>
                  <li>Center City</li>
                </ul>
                <p className="mt-4">
                  Our local expertise and commitment to excellence make us the preferred choice for carpentry services in these neighborhoods.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative h-[500px]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="https://static.wixstatic.com/media/dc69ab_baa3a4e8ed5d4fe79f2a58bfea9f0f4f~mv2.png"
                width={600}
                className="w-full h-full object-cover rounded-xl"
                originWidth={1632}
                originHeight={2592}
                focalPointX={48.086463501063164}
                focalPointY={34.93975903614458} />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Our Values */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="font-heading text-5xl text-secondary mb-4">Our Core Values</h2>
            <p className="font-paragraph text-lg text-foreground">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Quality First',
                description: 'We never compromise on materials or workmanship. Every detail matters.'
              },
              {
                icon: Users,
                title: 'Client Partnership',
                description: 'Your vision drives our work. We listen, collaborate, and deliver.'
              },
              {
                icon: Shield,
                title: 'Integrity Always',
                description: 'Honest quotes, realistic timelines, and transparent communication.'
              },
              {
                icon: TrendingUp,
                title: 'Continuous Improvement',
                description: 'We stay current with techniques, materials, and building codes.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-background border border-medium-grey/30 rounded-xl text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-2xl text-secondary mb-4">{value.title}</h3>
                    <p className="font-paragraph text-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Certifications & Credentials */}
      <section className="w-full bg-light-grey py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="font-heading text-5xl text-secondary mb-4">Certifications & Credentials</h2>
            <p className="font-paragraph text-lg text-foreground">Licensed, insured, and certified for your peace of mind</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'NJ Home Improvement Contractor License',
                number: '#13VH12345600',
                description: 'Fully licensed by the State of New Jersey'
              },
              {
                title: 'General Liability Insurance',
                number: '$2M Coverage',
                description: 'Comprehensive protection for every project'
              },
              {
                title: 'Workers Compensation',
                number: 'Full Coverage',
                description: 'All team members fully insured'
              },
              {
                title: 'EPA Lead-Safe Certified',
                number: 'Firm #NAT-F123456-1',
                description: 'Certified for lead-safe renovation work'
              },
              {
                title: 'OSHA Safety Trained',
                number: '30-Hour Certification',
                description: 'Committed to jobsite safety standards'
              },
              {
                title: 'Better Business Bureau',
                number: 'A+ Rating',
                description: 'Accredited with excellent standing'
              }
            ].map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-background border border-medium-grey/30 rounded-xl">
                  <CardContent className="p-8">
                    <Award className="w-12 h-12 text-primary mb-4" />
                    <h3 className="font-heading text-xl text-secondary mb-2">{cert.title}</h3>
                    <div className="font-heading text-primary mb-3">{cert.number}</div>
                    <p className="font-paragraph text-foreground">{cert.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Our Process */}
      <section className="w-full py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="font-heading text-5xl text-secondary mb-4">Our Process</h2>
            <p className="font-paragraph text-lg text-foreground">A clear, proven approach to every project</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                step: '01',
                title: 'Initial Consultation',
                description: 'We meet to discuss your vision, needs, and budget'
              },
              {
                step: '02',
                title: 'Detailed Estimate',
                description: 'Comprehensive quote with material and labor breakdown'
              },
              {
                step: '03',
                title: 'Design & Planning',
                description: 'Finalize plans, permits, and project timeline'
              },
              {
                step: '04',
                title: 'Construction',
                description: 'Daily updates, clean worksite, quality craftsmanship'
              },
              {
                step: '05',
                title: 'Final Walkthrough',
                description: 'Inspection, cleanup, and warranty documentation'
              }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="font-heading text-3xl text-primary">{process.step}</span>
                  </div>
                  <h3 className="font-heading text-xl text-secondary mb-3">{process.title}</h3>
                  <p className="font-paragraph text-foreground">{process.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Meet the Team */}
      <section id="team" className="w-full bg-light-grey py-24">

      </section>
      <Footer />
    </div>
  );
}
