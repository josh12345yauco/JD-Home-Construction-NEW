import { motion } from 'framer-motion';
import { CheckCircle, Award, Shield, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-8 pt-32 pb-24">
        <motion.div className="text-center max-w-4xl mx-auto" {...fadeInUp}>
          <h1 className="font-heading text-6xl lg:text-7xl text-secondary mb-6">Building Excellence Over a Decade</h1>
          <p className="font-paragraph text-xl text-foreground">
            We're a family-owned construction company dedicated to transforming houses into dream homes with quality craftsmanship and honest communication.
          </p>
        </motion.div>
      </section>
      {/* Our Story */}
      <section className="w-full bg-light-grey py-16 md:py-24">
        <div className="max-w-[100rem] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
            <motion.div {...fadeInUp} className="min-w-0">
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-secondary mb-6 break-words">About JD Home Construction: Your Trusted Philadelphia General Contractor</h1>
              <div className="space-y-4 font-paragraph text-sm sm:text-base md:text-lg text-foreground overflow-hidden">
                <p className="break-words">
                  Welcome to JD Home Construction, a fully licensed and insured general contracting firm based in the Port Richmond neighborhood of Philadelphia. For over a decade, our expert builders and carpenters have delivered top-tier residential construction, full-gut remodeling, and custom carpentry services for homeowners, investors, and businesses across the city.
                </p>
                <p className="break-words">
                  While we excel in carpentry and related services, please note that we do not provide plumbing, electrical, roofing, or HVAC services. However, we have established partnerships with trusted professionals in these fields and are happy to give referrals to ensure your project is seamless from start to finish.
                </p>
                <p className="font-heading text-base sm:text-lg md:text-xl text-secondary mt-6 mb-3 break-words">Areas We Service</p>
                <p className="break-words">
                  JD Home Construction proudly serves the following Philadelphia neighborhoods:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 overflow-hidden">
                  <li className="break-words">Queens Village</li>
                  <li className="break-words">Fishtown</li>
                  <li className="break-words">Fairmount</li>
                  <li className="break-words">Northern Liberties</li>
                  <li className="break-words">Center City</li>
                  <li className="break-words">Washington Square West</li>
                </ul>
                <p className="mt-4 break-words">
                  Our local expertise and commitment to excellence make us the preferred choice for carpentry services in these neighborhoods.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="https://static.wixstatic.com/media/nsplsh_99d07237c1974eeb8d9cb550339e7271~mv2.jpg"
                width={500}
                className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                originWidth={3649}
                originHeight={2433}
                alt="JD Home Construction project" />
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'P.A home improvement Contractor License',
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
                title: 'OSHA Safety Trained',
                number: '30-Hour Certification',
                description: 'Committed to jobsite safety standards'
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
      <Footer />
    </div>
  );
}
