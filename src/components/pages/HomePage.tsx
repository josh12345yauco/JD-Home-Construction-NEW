// HPI 1.7-V
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, Clock, Shield, Star, CheckCircle,
  Users, Award, Ruler, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Animation Variants ---
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

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // --- Scroll Hooks for Parallax ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const heroParallax = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  // Static data for services
  const staticServices = [
    { id: '1', serviceName: 'Bathrooms', shortDescription: 'Renovations & full build-outs' },
    { id: '2', serviceName: 'Kitchens', shortDescription: 'Renovations & full build-outs' },
    { id: '3', serviceName: 'Interiors', shortDescription: 'Framing, Drywall, Painting, Mill-Work' },
    { id: '4', serviceName: 'Exteriors', shortDescription: 'Framing, Siding, Concrete' },
    { id: '5', serviceName: 'Snow Control', shortDescription: 'Prep, Salting, Plowing' }
  ];

  // Static data for projects
  const staticProjects = [
    { id: '1', projectTitle: 'Modern Kitchen Remodel', category: 'Kitchens', scopeOfWork: 'Complete kitchen renovation with new cabinets and appliances', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' },
    { id: '2', projectTitle: 'Luxury Bathroom Suite', category: 'Baths', scopeOfWork: 'Spa-like bathroom with heated floors and custom tile', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' },
    { id: '3', projectTitle: 'Home Addition', category: 'Additions', scopeOfWork: 'New master suite addition with custom finishes', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' },
    { id: '4', projectTitle: 'Outdoor Deck', category: 'Decks', scopeOfWork: 'Large composite deck with built-in seating', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' },
    { id: '5', projectTitle: 'Exterior Renovation', category: 'Exteriors', scopeOfWork: 'New siding and roofing for complete exterior refresh', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' },
    { id: '6', projectTitle: 'Full Home Remodel', category: 'Additions', scopeOfWork: 'Multi-room renovation with structural updates', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' }
  ];

  // Static data for team members
  const staticTeamMembers = [
    { id: '1', name: 'John Davis', role: 'Owner & Lead Contractor', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384', bio: 'With 20+ years of experience, John leads every project with precision and care.' },
    { id: '2', name: 'Sarah Mitchell', role: 'Project Manager', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384', bio: 'Sarah ensures every project stays on schedule and exceeds expectations.' },
    { id: '3', name: 'Mike Thompson', role: 'Master Carpenter', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384', bio: 'Mike brings 15 years of carpentry expertise to every detail.' }
  ];

  // Static data for blog posts
  const staticBlogPosts = [
    { id: '1', title: 'Kitchen Design Trends for 2024', category: 'Design', excerpt: 'Discover the latest kitchen design trends that will transform your space.', mainImage: 'https://static.wixstatic.com/media/dc69ab_1ba6ba87cef043d4ad72cb73a877f758~mv2.png?originWidth=512&originHeight=320' },
    { id: '2', title: 'How to Plan Your Bathroom Remodel', category: 'Guide', excerpt: 'A comprehensive guide to planning your perfect bathroom renovation.', mainImage: 'https://static.wixstatic.com/media/dc69ab_1ba6ba87cef043d4ad72cb73a877f758~mv2.png?originWidth=512&originHeight=320' },
    { id: '3', title: 'Maximizing Your Home Addition Budget', category: 'Tips', excerpt: 'Smart strategies to get the most value from your home addition project.', mainImage: 'https://static.wixstatic.com/media/dc69ab_1ba6ba87cef043d4ad72cb73a877f758~mv2.png?originWidth=512&originHeight=320' }
  ];

  const categories = ['All', 'Kitchens', 'Baths', 'Exteriors', 'Additions', 'Decks'];

  return (
    <div ref={containerRef} className="min-h-screen bg-background font-paragraph selection:bg-primary selection:text-white overflow-clip">
      <Header />
      {/* --- SECTION 1: HERO (Havix Style Split) --- */}
      <section className="relative w-full min-h-[95vh] flex items-center pt-32 pb-20 overflow-hidden bg-secondary">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-secondary z-10" />
        </div>

        <div className="relative z-20 w-full max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
                <span className="h-[2px] w-12 bg-accent-orange"></span>
                <span className="font-heading text-sm tracking-widest uppercase text-accent-orange font-bold">GENERAL Contracting Services</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="font-heading text-6xl lg:text-8xl font-bold text-white leading-[0.95] mb-8">
                Build It Right.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Build It Once.</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="font-paragraph text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
                Remodels, additions, and exterior upgrades done with craftsmanship, clear communication, and a clean jobsite—start to finish.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent-orange hover:bg-accent-orange/90 text-secondary font-heading text-lg px-10 h-16 rounded-full shadow-lg shadow-accent-orange/20 transition-all hover:scale-105">
                  <Link to="/contact">Request a Quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-secondary font-heading text-lg px-10 h-16 rounded-full transition-all">
                  <Link to="/projects">View Our Work</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: Stacked Cards (Havix Style) */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="relative hidden lg:block aspect-video"
            >
              {/* Video Container with rounded corners behind cards */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden z-0">
                <motion.div style={{ y: heroParallax }} className="w-full h-full">
                  <video 
                    src="https://video.wixstatic.com/video/dc69ab_44c00543c0c544d7a67554fb7aa0d36f/720p/mp4/file.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Decorative Grid Behind */}
              <div className="absolute top-0 right-0 w-3/4 h-full border-r border-t border-white/10 rounded-tr-[4rem] z-5" />

              {/* Stacked Cards Container - Aligned Right */}
              <div className="absolute inset-0 flex flex-col items-end justify-start pt-0 pr-12 z-20" style={{ top: '-80px' }}>
                {/* Card 1 */}
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="w-64 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-accent-orange opacity-[1] bg-[transparent]">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-2xl mb-2 text-secondary">Fast Estimates</h3>
                  <p className="font-paragraph text-secondary">Hear back within 1 business day. No chasing required.</p>
                </motion.div>

                {/* Card 2 - 20px gap */}
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="w-64 bg-accent-orange/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl mt-5 border border-accent-orange/40"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-secondary bg-[transparent]">
                    <Shield className="w-8 h-8 fill-transparent" />
                  </div>
                  <h3 className="font-heading text-2xl text-secondary mb-2">Licensed & Insured</h3>
                  <p className="font-paragraph text-secondary/80">Professional, warranty-backed work you can trust.</p>
                </motion.div>
              </div>

              {/* Abstract Shape */}
              <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent-orange/10 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>
      {/* --- SECTION 1.5: ANIMATED COUNTERS --- */}
      <section className="w-full py-20 bg-secondary text-white border-b border-white/10">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <motion.div 
              className="flex flex-col items-start"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0 * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="font-heading text-4xl lg:text-5xl font-bold text-white mb-1">100+</span>
              <span className="font-paragraph text-sm font-semibold text-accent-orange uppercase tracking-wider">Projects Completed</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-start"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="font-heading text-4xl lg:text-5xl font-bold text-white mb-1">
                15+
              </span>
              <span className="font-paragraph text-sm font-semibold text-accent-orange uppercase tracking-wider">Years Experience</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-start"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="font-heading text-4xl lg:text-5xl font-bold text-white mb-1">
                4.9★
              </span>
              <span className="font-paragraph text-sm font-semibold text-accent-orange uppercase tracking-wider">Client Reviews</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-start"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3 * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="font-heading text-4xl lg:text-5xl font-bold text-white mb-1">90%</span>
              <span className="font-paragraph text-sm font-semibold text-accent-orange uppercase tracking-wider">On-Time Rate</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* --- SECTION 2: ABOUT PREVIEW --- */}
      <section className="w-full py-32 bg-light-grey relative overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image Collage */}
            <div className="relative h-[510px] w-full hidden lg:block">
              <div className="absolute top-0 left-0 w-4/5 h-4/5 rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://static.wixstatic.com/media/dc69ab_4d13225c8d4840838b4b2aebefea4bde~mv2.png?originWidth=896&originHeight=576"
                  alt="JD Construction Team"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-3xl overflow-hidden shadow-2xl border-8 border-light-grey">
                <Image 
                  src="https://static.wixstatic.com/media/dc69ab_155bbc77273d448282916cc9bcd36f39~mv2.png?originWidth=896&originHeight=576"
                  alt="Detail Work"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Content */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="font-heading text-5xl lg:text-6xl text-secondary mb-8">
                Built on Trust,<br />Delivered with Pride.
              </motion.h2>
              <motion.p variants={fadeInUp} className="font-paragraph text-lg text-foreground/80 mb-10 leading-relaxed">
                For over 15 years, JD Construction has been the go-to contractor for homeowners who want quality work without the runaround. We believe in doing things right—clear quotes, honest timelines, and craftsmanship that lasts.
              </motion.p>
              
              <motion.ul variants={staggerContainer} className="space-y-6 mb-12">
                {[
                  "Transparent pricing with detailed breakdowns",
                  "Daily communication and progress updates",
                  "Detail-driven craftsmanship on every project"
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeInUp} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="font-heading text-xl text-secondary">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-10">
                {["Licensed & Insured", "5-Year Warranty", "Clean Jobsite Standards"].map((badge, i) => (
                  <span key={i} className="px-4 py-2 bg-white border border-medium-grey/30 rounded-lg font-heading text-sm text-secondary shadow-sm">
                    {badge}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Button asChild variant="outline" className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-heading px-8 h-12 rounded-lg">
                  <Link to="/about">Learn About JD</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* --- SECTION 3: SCROLLING HIGHLIGHT BAND --- */}
      <div className="w-full bg-secondary py-8 overflow-hidden border-y border-white/10">
        <div className="relative flex overflow-x-hidden group">
          <motion.div 
            className="flex whitespace-nowrap gap-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 items-center">
                {["Kitchens", "Baths", "Additions", "Decks", "Roofing", "Siding", "Windows", "Finish Carpentry"].map((item, j) => (
                  <div key={j} className="flex items-center gap-16">
                    <span className="font-heading text-3xl text-white/90 uppercase tracking-widest">{item}</span>
                    <span className="w-3 h-3 bg-primary rounded-full" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      {/* --- SECTION 4: SERVICES GRID --- */}
      <section id="services" className="w-full relative overflow-hidden">
        <motion.div
          className="relative w-full h-96 group"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Full-width background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://static.wixstatic.com/media/dc69ab_58bdb24921814572b337c062c0871b10~mv2.png?originWidth=896&originHeight=576')`
            }}
          />
          
          {/* Dark overlay that disappears on hover */}
          <motion.div 
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0.6 }}
            whileHover={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Centered content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-primary font-heading font-bold tracking-widest uppercase mb-4 block text-sm">Our Expertise</span>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4">
                Comprehensive<br />Construction Services
              </h2>
              <p className="font-paragraph text-lg text-white/90 max-w-2xl mx-auto">
                Expert solutions tailored to your project needs
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Services cards - full width */}
        <div className="w-full bg-white py-24">
          <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
            {/* Header with label, headline, and link */}
            <div className="mb-16">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <p className="font-heading text-xs uppercase tracking-widest text-primary mb-4 font-bold">
                      OUR SERVICES
                    </p>
                    <h2 className="font-heading text-4xl lg:text-5xl text-secondary leading-tight">
                      Built to Handle Every Part of Your Project
                    </h2>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex-shrink-0"
                >
                  <Button asChild variant="ghost" className="text-secondary hover:text-primary font-heading text-base group whitespace-nowrap">
                    <Link to="/services">
                      View All Services <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Services grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
              {staticServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="h-full"
                >
                  <div className="group block h-full w-full">
                    <Card className="h-full bg-white border border-medium-grey/30 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col p-6">
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-heading text-lg text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                          {service.serviceName}
                        </h3>
                        <p className="font-paragraph text-sm text-foreground/60 mb-6 flex-1 leading-relaxed">
                          {service.shortDescription}
                        </p>
                      </div>
                      <motion.div 
                        className="flex items-center text-primary font-heading font-bold text-xs uppercase tracking-wider"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        Learn More <ArrowRight className="w-3.5 h-3.5 ml-2 flex-shrink-0" />
                      </motion.div>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* --- SECTION 5: MID-PAGE CTA --- */}
      <section className="w-full py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('https://static.wixstatic.com/media/dc69ab_11ce17a665e04401ae0ddf39b3d036eb~mv2.png?originWidth=1920&originHeight=576')`}} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="max-w-[100rem] mx-auto px-6 lg:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-5xl lg:text-7xl text-white mb-6">
              Want a contractor who<br />actually communicates?
            </h2>
            <p className="font-paragraph text-xl lg:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
              Clear timelines, clean work, and a process you'll feel good about.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-secondary hover:bg-secondary hover:text-white font-heading text-lg px-10 h-16 rounded-full shadow-xl transition-all">
                <Link to="/contact">Request a Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-primary font-heading text-lg px-10 h-16 rounded-full transition-all bg-transparent">
                <Link to="/projects">See Projects</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* --- SECTION 6: TESTIMONIALS --- */}
      <section className="w-full py-32 bg-light-grey">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <span className="text-primary font-heading font-bold tracking-widest uppercase mb-4 block">Testimonials</span>
            <h2 className="font-heading text-5xl text-secondary">What Our Clients Say</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', location: 'Westfield', text: 'JD Construction transformed our outdated kitchen into a modern masterpiece. The attention to detail was incredible.' },
              { name: 'Mike R.', location: 'Summit', text: 'Professional from start to finish. They communicated every step of the way and the quality of work exceeded our expectations.' },
              { name: 'Jennifer L.', location: 'Cranford', text: 'Our bathroom remodel was completed beautifully. The team was respectful, clean, and the craftsmanship is top-notch.' },
              { name: 'Tom B.', location: 'Scotch Plains', text: 'Added a deck and outdoor living space. The design suggestions were spot-on and the construction quality is excellent.' },
              { name: 'Lisa K.', location: 'Mountainside', text: 'Transparent pricing, no hidden fees, and they finished on time. JD Construction made our home addition project stress-free.' },
              { name: 'David H.', location: 'Fanwood', text: 'Best contractor we\'ve worked with. They handled our roofing and siding project with professionalism.' }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white border-none shadow-lg p-8 rounded-2xl relative">
                  <div className="absolute top-8 right-8 text-primary/20">
                    <Star className="w-12 h-12 fill-current" />
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="font-paragraph text-lg text-foreground/80 mb-8 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-heading font-bold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-heading text-lg text-secondary font-bold">{testimonial.name}</div>
                      <div className="font-paragraph text-sm text-primary">{testimonial.location}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* --- SECTION 7: 3D CAROUSEL GALLERY --- */}
      <section className="w-full py-32 bg-background overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl lg:text-6xl text-secondary mb-4">Gallery of Work</h2>
            <p className="font-paragraph text-lg text-foreground/70">Explore our portfolio of completed projects</p>
          </div>

          {staticProjects.length > 0 ? (
            <div className="relative h-[600px] flex items-center justify-center perspective">
              {/* Carousel Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Background carousel items */}
                {staticProjects.map((project, idx) => {
                  const position = (idx - carouselIndex + staticProjects.length) % staticProjects.length;
                  const isCenter = position === 0;
                  const isLeft = position === staticProjects.length - 1;
                  const isRight = position === 1;
                  
                  let translateX = 0;
                  let translateZ = 0;
                  let rotateY = 0;
                  let opacity = 0;
                  let scale = 0.7;

                  if (isCenter) {
                    translateX = 0;
                    translateZ = 0;
                    rotateY = 0;
                    opacity = 1;
                    scale = 1;
                  } else if (isRight) {
                    translateX = 280;
                    translateZ = -200;
                    rotateY = -35;
                    opacity = 0.6;
                    scale = 0.8;
                  } else if (isLeft) {
                    translateX = -280;
                    translateZ = -200;
                    rotateY = 35;
                    opacity = 0.6;
                    scale = 0.8;
                  } else {
                    opacity = 0;
                    scale = 0.6;
                  }

                  return (
                    <motion.div
                      key={project.id}
                      initial={false}
                      animate={{
                        x: translateX,
                        z: translateZ,
                        rotateY: rotateY,
                        opacity: opacity,
                        scale: scale,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="absolute w-full max-w-md h-96 rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
                      style={{
                        perspective: '1000px',
                      }}
                    >
                      <div className="block w-full h-full group">
                        <div className="relative w-full h-full">
                          <Image
                            src={project.beforeImage}
                            alt={project.projectTitle}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                          
                          {/* Content Overlay */}
                          <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-3 py-1 bg-primary text-white text-xs font-heading uppercase tracking-wider rounded-md">
                                {project.category}
                              </span>
                            </div>
                            <h3 className="font-heading text-2xl text-white mb-2">{project.projectTitle}</h3>
                            <p className="font-paragraph text-white/80 text-sm line-clamp-1">{project.scopeOfWork}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={() => setCarouselIndex((prev) => (prev - 1 + staticProjects.length) % staticProjects.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-primary hover:text-white text-secondary p-4 rounded-full shadow-lg transition-all duration-300 -ml-8 lg:-ml-16"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCarouselIndex((prev) => (prev + 1) % staticProjects.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-primary hover:text-white text-secondary p-4 rounded-full shadow-lg transition-all duration-300 -mr-8 lg:-mr-16"
                aria-label="Next project"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {staticProjects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === carouselIndex ? 'bg-primary w-8' : 'bg-medium-grey w-2 hover:bg-primary/60'
                    }`}
                    aria-label={`Go to project ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-paragraph text-xl text-foreground/60">No projects available.</p>
            </div>
          )}

          {/* View All Link */}
          <div className="text-center mt-16">
            <Button asChild variant="outline" className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-heading px-8 h-12 rounded-lg">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* --- SECTION 8: WHY CHOOSE JD --- */}
      <section className="w-full py-32 bg-light-grey">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-heading text-5xl text-secondary mb-12">Why Choose JD Construction</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: Ruler, title: 'Detailed Scope', text: 'No surprises. Comprehensive plans and transparent pricing.' },
                  { icon: Users, title: 'Respectful Crews', text: 'Professional teams who treat your home with care.' },
                  { icon: Award, title: 'Quality Materials', text: 'Premium materials and proven techniques for lasting results.' },
                  { icon: Shield, title: 'Warranty-Backed', text: '5-year warranty on all workmanship for your peace of mind.' }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-medium-grey/10"
                  >
                    <feature.icon className="w-10 h-10 text-primary mb-6" />
                    <h3 className="font-heading text-xl text-secondary mb-3 font-bold">{feature.title}</h3>
                    <p className="font-paragraph text-sm text-foreground/70">{feature.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative h-[600px]">
              <div className="absolute inset-0 bg-secondary rounded-3xl transform rotate-3" />
              <div className="absolute inset-0 bg-white rounded-3xl transform -rotate-3 overflow-hidden border-4 border-white shadow-2xl">
                <Image 
                  src="https://static.wixstatic.com/media/dc69ab_330eb5297f624b7a850fc6b54fec634f~mv2.png?originWidth=896&originHeight=576"
                  alt="Craftsman at work"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --- SECTION 9: COUNTERS STRIP --- */}
      <section className="w-full py-20 bg-secondary text-white">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center divide-x divide-white/10">
            {[
              { val: "2,500+", label: "5-Star Reviews" },
              { val: "85%", label: "Repeat Clients" },
              { val: "92%", label: "Referral Rate" },
              { val: "47", label: "Projects This Year" }
            ].map((stat, i) => (
              <div key={i} className="px-4">
                <div className="font-heading text-5xl lg:text-6xl text-primary mb-2 font-bold">{stat.val}</div>
                <div className="font-paragraph text-lg text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* --- SECTION 10: TEAM PREVIEW --- */}
      <section className="w-full py-32 bg-background">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl text-secondary mb-4">Meet the Team</h2>
            <p className="font-paragraph text-lg text-foreground/70">Experienced professionals dedicated to your project</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {staticTeamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden border-none shadow-lg rounded-2xl group">
                  <div className="relative h-96 overflow-hidden">
                    <Image 
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                      <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="font-paragraph text-sm mb-2">{member.bio?.substring(0, 100)}...</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-white text-center relative z-10">
                    <h3 className="font-heading text-2xl text-secondary font-bold">{member.name}</h3>
                    <p className="font-paragraph text-primary font-medium">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* --- SECTION 11: ESTIMATE OPTIONS --- */}
      <section className="w-full py-32 bg-light-grey">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl text-secondary mb-4">Project Types</h2>
            <p className="font-paragraph text-lg text-foreground/70">Tailored approaches for every scale</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {[
              {
                title: 'Small Projects',
                desc: 'Repairs & Updates',
                features: ['Single-room updates', 'Fixture replacements', 'Minor repairs', 'Quick turnaround'],
                time: '1-2 weeks'
              },
              {
                title: 'Remodels',
                desc: 'Transformations',
                features: ['Full room renovations', 'Layout changes', 'Custom cabinetry', 'Quality finishes'],
                time: '4-8 weeks',
                featured: true
              },
              {
                title: 'Full Renovations',
                desc: 'Major Upgrades',
                features: ['Home additions', 'Multi-room remodels', 'Structural changes', 'Complete overhaul'],
                time: '8-16 weeks'
              }
            ].map((opt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white rounded-3xl p-10 border ${opt.featured ? 'border-primary shadow-2xl scale-105 z-10' : 'border-medium-grey/20 shadow-lg'}`}
              >
                {opt.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full font-heading text-sm uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="font-heading text-3xl text-secondary mb-2 font-bold">{opt.title}</h3>
                <p className="font-paragraph text-foreground/60 mb-8">{opt.desc}</p>
                
                <ul className="space-y-4 mb-10">
                  {opt.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span className="font-paragraph text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-medium-grey/10 pt-6 mb-8">
                  <span className="block font-paragraph text-xs text-foreground/50 uppercase tracking-wider mb-1">Typical Timeline</span>
                  <span className="font-heading text-xl text-secondary font-bold">{opt.time}</span>
                </div>

                <Button asChild className={`w-full h-14 font-heading text-lg rounded-xl ${opt.featured ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'}`}>
                  <Link to="/contact">Get an Estimate</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* --- SECTION 12: REQUEST ESTIMATE FORM --- */}
      <section id="quote-form" className="w-full py-32 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl text-secondary mb-6">Request Your Estimate</h2>
            <p className="font-paragraph text-lg text-foreground/70">
              Tell us about your project. We'll review your details and get back to you within 1 business day.
            </p>
          </div>

          <Card className="border border-medium-grey/20 shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <CardContent className="p-10 lg:p-16">
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-heading text-secondary font-bold">Name</label>
                    <Input placeholder="Full Name" className="h-14 rounded-xl bg-light-grey border-transparent focus:border-primary focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-heading text-secondary font-bold">Email</label>
                    <Input type="email" placeholder="email@address.com" className="h-14 rounded-xl bg-light-grey border-transparent focus:border-primary focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-heading text-secondary font-bold">Phone</label>
                    <Input type="tel" placeholder="(555) 123-4567" className="h-14 rounded-xl bg-light-grey border-transparent focus:border-primary focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-heading text-secondary font-bold">Zip Code</label>
                    <Input placeholder="07090" className="h-14 rounded-xl bg-light-grey border-transparent focus:border-primary focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-heading text-secondary font-bold">Project Type</label>
                    <Select>
                      <SelectTrigger className="h-14 rounded-xl bg-light-grey border-transparent focus:border-primary focus:bg-white transition-all">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kitchen">Kitchen Remodel</SelectItem>
                        <SelectItem value="bathroom">Bathroom Remodel</SelectItem>
                        <SelectItem value="addition">Home Addition</SelectItem>
                        <SelectItem value="deck">Deck/Outdoor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-heading text-secondary font-bold">Budget Range</label>
                    <Select>
                      <SelectTrigger className="h-14 rounded-xl bg-light-grey border-transparent focus:border-primary focus:bg-white transition-all">
                        <SelectValue placeholder="Select Budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10-25k">$10k - $25k</SelectItem>
                        <SelectItem value="25-50k">$25k - $50k</SelectItem>
                        <SelectItem value="50-100k">$50k - $100k</SelectItem>
                        <SelectItem value="100k+">$100k+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-heading text-secondary font-bold">Project Details</label>
                  <Textarea 
                    placeholder="Describe your vision, specific requirements, or any questions you have..." 
                    className="min-h-[150px] rounded-xl bg-light-grey border-transparent focus:border-primary focus:bg-white transition-all p-6"
                  />
                </div>

                <Button size="lg" className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-heading text-xl rounded-xl shadow-lg transition-all hover:scale-[1.01]">
                  Request My Quote
                </Button>
                
                <p className="text-center text-sm text-foreground/50 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" /> Your information is secure and never shared.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* --- SECTION 13: BLOG PREVIEW --- */}
      <section className="w-full py-32 bg-light-grey">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="font-heading text-5xl text-secondary mb-4">Latest Insights</h2>
              <p className="font-paragraph text-lg text-foreground/70">Tips and guides for homeowners</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-heading px-8 h-12 rounded-lg">
              <Link to="/blog">View All Articles</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {staticBlogPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="group block h-full">
                  <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden">
                    <div className="h-56 overflow-hidden">
                      <Image 
                        src={post.mainImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-8">
                      <div className="text-primary text-xs font-heading uppercase tracking-wider mb-3">{post.category}</div>
                      <h3 className="font-heading text-xl text-secondary font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="font-paragraph text-sm text-foreground/70 line-clamp-3 mb-6">{post.excerpt}</p>
                      <div className="flex items-center text-secondary font-heading text-sm font-bold group-hover:translate-x-2 transition-transform">
                        Read Article <ArrowRight className="ml-2 w-4 h-4 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Button asChild variant="outline" className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-heading px-8 h-12 rounded-lg">
              <Link to="/blog">View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
