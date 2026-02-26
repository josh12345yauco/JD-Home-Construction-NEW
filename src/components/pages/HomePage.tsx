// HPI 1.7-V
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCounterAnimation } from '@/hooks/use-counter-animation';
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
import InstagramFeed from '@/components/InstagramFeed';
import { BaseCrudService } from '@/integrations';
import { Projects, Services } from '@/entities';

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

// Parallax Image Component
function ParallaxImage() {
  return null;
}

// Animated Counter Component
function AnimatedCounter({ targetValue, label, delay, suffix = "+" }: { targetValue: number; label: string; delay: number; suffix?: string }) {
  const count = useCounterAnimation(targetValue, 2000);

  return (
    <motion.div 
      className="flex flex-col items-start"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <span className="font-heading text-4xl lg:text-5xl font-bold text-white mb-1">
        {count}{suffix}
      </span>
      <span className="font-paragraph text-sm font-semibold text-accent-orange uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

// Animated Counter Component for Rating
function AnimatedCounterRating({ targetValue, label, delay }: { targetValue: number; label: string; delay: number }) {
  const count = useCounterAnimation(Math.floor(targetValue * 10), 2000);
  const displayValue = (count / 10).toFixed(1);

  return (
    <motion.div 
      className="flex flex-col items-start"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <span className="font-heading text-4xl lg:text-5xl font-bold text-white mb-1">
        {displayValue}★
      </span>
      <span className="font-paragraph text-sm font-semibold text-accent-orange uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState<Projects[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [services, setServices] = useState<Services[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // --- Scroll Hooks for Parallax ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const heroParallax = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  // Fetch projects and services from CMS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResult, servicesResult] = await Promise.all([
          BaseCrudService.getAll<Projects>('projects', {}, { limit: 50 }),
          BaseCrudService.getAll<Services>('services', {}, { limit: 50 })
        ]);
        setProjects(projectsResult?.items || []);
        setServices(servicesResult?.items || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProjects([]);
        setServices([]);
      } finally {
        setIsLoadingProjects(false);
        setIsLoadingServices(false);
      }
    };
    
    fetchData();
  }, []);

  // Use CMS services data with fallback
  const staticServices = services.length > 0 ? services : [
    { _id: '1', serviceName: 'Bathrooms', shortDescription: 'Renovations & full build-outs', serviceImage: 'https://static.wixstatic.com/media/dc69ab_f8a9917780704b328eed0f883f294af6~mv2.png' },
    { _id: '2', serviceName: 'Kitchens', shortDescription: 'Renovations & full build-outs', serviceImage: 'https://static.wixstatic.com/media/dc69ab_1cfe66c1dbcb4cdb85008f53486f6406~mv2.png' },
    { _id: '3', serviceName: 'Interiors', shortDescription: 'Framing, Drywall, Painting, Mill-Work', serviceImage: 'https://static.wixstatic.com/media/dc69ab_f8a9917780704b328eed0f883f294af6~mv2.png' },
    { _id: '4', serviceName: 'Exteriors', shortDescription: 'Framing, Siding, Concrete', serviceImage: 'https://static.wixstatic.com/media/dc69ab_1cfe66c1dbcb4cdb85008f53486f6406~mv2.png' },
    { _id: '5', serviceName: 'Snow Control', shortDescription: 'Prep, Salting, Plowing', serviceImage: 'https://static.wixstatic.com/media/dc69ab_f8a9917780704b328eed0f883f294af6~mv2.png' }
  ];

  // Static data for projects (fallback)
  const staticProjects = [
    { _id: '1', projectTitle: 'Modern Kitchen Remodel', category: 'Kitchens', scopeOfWork: 'Complete kitchen renovation with new cabinets and appliances', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' },
    { _id: '2', projectTitle: 'Luxury Bathroom Suite', category: 'Baths', scopeOfWork: 'Spa-like bathroom with heated floors and custom tile', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' },
    { _id: '3', projectTitle: 'Home Addition', category: 'Additions', scopeOfWork: 'New master suite addition with custom finishes', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' },
    { _id: '4', projectTitle: 'Outdoor Deck', category: 'Decks', scopeOfWork: 'Large composite deck with built-in seating', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' },
    { _id: '5', projectTitle: 'Exterior Renovation', category: 'Exteriors', scopeOfWork: 'New siding and roofing for complete exterior refresh', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' },
    { _id: '6', projectTitle: 'Full Home Remodel', category: 'Additions', scopeOfWork: 'Multi-room renovation with structural updates', beforeImage: 'https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png?originWidth=768&originHeight=448' }
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
      <section className="relative w-full min-h-auto lg:min-h-[95vh] flex items-center pt-20 lg:pt-32 pb-20 overflow-hidden bg-secondary">
        {/* Background Elements */}
        <ParallaxImage />
        <div className="absolute inset-0 bg-black/90 z-10" />

        <div className="relative z-20 w-full max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left: Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl w-full"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
                <span className="h-[2px] w-12 bg-accent-orange"></span>
                <span className="font-heading text-sm tracking-widest uppercase text-accent-orange font-bold">PHILADELPHIA GENERAL Contracting Services</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="font-heading text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[0.95] mb-8">
                Build It Right.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Build It Once.</span>
              </motion.h1>
              
              {/* Mobile Video - shown only on mobile, positioned under heading */}
              <div className="lg:hidden rounded-3xl overflow-hidden w-full h-full aspect-video mb-8">
                <motion.div style={{ y: heroParallax }} className="w-full h-full">
                  <video 
                    src="https://video.wixstatic.com/video/dc69ab_57513eb7b01340659ce8d7dd858d96ed/720p/mp4/file.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              
              <motion.p variants={fadeInUp} className="font-paragraph text-base sm:text-lg lg:text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
                Remodels, additions, and exterior upgrades done with craftsmanship, clear communication, and a clean jobsite—start to finish.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent-orange hover:bg-accent-orange/90 text-secondary font-heading text-base sm:text-lg px-8 sm:px-10 h-14 sm:h-16 rounded-full shadow-lg shadow-accent-orange/20 transition-all hover:scale-105">
                  <Link to="/contact" className="rounded-[5px]">Request a Quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-secondary font-heading text-base sm:text-lg px-8 sm:px-10 h-14 sm:h-16 rounded-full transition-all">
                  <Link to="/projects" className="rounded-[5px]">View Our Work</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: Video and Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              {/* Video Container - Hidden on mobile, shown on lg */}
              <div className="hidden lg:block rounded-3xl overflow-hidden w-full aspect-video">
                <motion.div style={{ y: heroParallax }} className="w-full h-full">
                  <video 
                    src="https://video.wixstatic.com/video/dc69ab_57513eb7b01340659ce8d7dd858d96ed/720p/mp4/file.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Cards Container - Vertical Layout */}
              <div className="flex flex-col gap-6">
                {/* Card 2 */}
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="flex-1 bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-accent-orange opacity-[1] bg-[transparent]">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-xl sm:text-2xl mb-2 text-secondary-foreground">Fast Estimates</h3>
                      <p className="font-paragraph text-sm sm:text-base text-secondary-foreground">Hear back within 1 business day. No chasing required.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 1 */}
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="flex-1 bg-accent-orange/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-accent-orange/40 relative z-10"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-secondary bg-[transparent]">
                      <Shield className="w-6 h-6 sm:w-8 sm:h-8 fill-transparent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-xl sm:text-2xl text-secondary mb-2">Licensed & Insured</h3>
                      <p className="font-paragraph text-sm sm:text-base text-secondary/80">Professional, warranty-backed work you can trust.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
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
            <AnimatedCounter targetValue={100} label="Projects Completed" delay={0} />
            <AnimatedCounter targetValue={15} label="Years Experience" delay={0.1} />
            <AnimatedCounterRating targetValue={4.9} label="Client Reviews" delay={0.2} />
            <AnimatedCounter targetValue={90} label="On-Time Rate" delay={0.3} suffix="%" />
          </motion.div>
        </div>
      </section>
      {/* --- SECTION 2: ABOUT PREVIEW --- */}
      <section className="w-full py-32 bg-light-grey relative overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left: Image Collage */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[600px] hidden lg:block"
            >
              {/* Background rotated box */}
              <div className="absolute inset-0 bg-secondary rounded-3xl transform -rotate-3" />
              {/* Image container */}
              <div className="absolute inset-0 bg-white rounded-3xl transform rotate-3 overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src="https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png"
                  alt="JD Construction Team"
                  className="w-full h-full object-cover"
                  originWidth={800}
                  originHeight={600}
                />
              </div>
            </motion.div>

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
                <span className="px-4 py-2 bg-white border border-medium-grey/30 rounded-lg font-heading text-sm text-secondary shadow-sm">
                  Licensed & Insured
                </span>
                <span className="px-4 py-2 bg-white border border-medium-grey/30 rounded-lg font-heading text-sm text-secondary shadow-sm">
                  Warranty
                </span>
                <span className="px-4 py-2 bg-white border border-medium-grey/30 rounded-lg font-heading text-sm text-secondary shadow-sm">
                  Clean Jobsite Standards
                </span>
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
          className="relative w-full h-96 group bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Centered content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-primary font-heading font-bold tracking-widest uppercase mb-4 block text-sm">Our Expertise</span>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-black mb-4">
                Comprehensive<br />Construction Services
              </h2>
              <p className="font-paragraph text-lg text-black/80 max-w-2xl mx-auto">
                Expert solutions tailored to your project needs
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Services cards - full width */}
        <div className="w-full bg-white pb-24">
          <div className="w-full">
            {/* Services grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px w-full">
              {staticServices.slice(0, 5).map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="h-full"
                >
                  <div className="group block h-full w-full">
                    <motion.div 
                      className="h-full min-h-96 relative overflow-hidden hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Service Image */}
                      {service.serviceImage && (
                        <Image
                          src={service.serviceImage}
                          alt={service.serviceName || 'Service'}
                          className="w-full h-full object-cover"
                          originWidth={800}
                          originHeight={600}
                        />
                      )}
                      {/* 40% black overlay */}
                      <div className="absolute inset-0 bg-black/40" />
                      {/* Content overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <h3 className="font-heading text-2xl md:text-xl text-white mb-4">{service.serviceName}</h3>
                        <Link to={`/services/${service._id}`} className="text-white hover:text-primary transition-colors font-paragraph text-sm underline">
                          Learn More
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
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
        </div>
      </section>
      {/* --- SECTION 5: MID-PAGE CTA --- */}
      <section className="w-full py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('https://static.wixstatic.com/media/dc69ab_5010fad45c2a4e18965251f844446b07~mv2.jpg')`}} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="max-w-[100rem] mx-auto px-6 lg:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-5xl lg:text-7xl text-white m-0">
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
      {/* --- SECTION 6: ULTRA-PREMIUM TESTIMONIALS --- */}
      <section className="w-full py-32 bg-[#F7F7F7] overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-16 items-center min-h-[600px]">
            {/* Left Column: Authority Block */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center"
            >
              {/* Rating Number */}
              <div className="mb-6">
                <span className="font-heading text-7xl lg:text-8xl font-bold text-secondary leading-none">4.9</span>
              </div>

              {/* Gold Stars */}
              <div className="flex gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-[#C9A14A] fill-primary" />
                ))}
              </div>

              {/* Review Count */}
              <p className="font-paragraph text-sm text-foreground/60 mb-8 tracking-wide">95+ Reviews</p>

              {/* Trust Paragraph */}
              <p className="font-paragraph text-lg leading-relaxed text-foreground/80 max-w-sm">
                Trusted by hundreds of happy clients — our 4.9-star rating reflects top-quality service and customer satisfaction every time.
              </p>
            </motion.div>

            {/* Right Area: Testimonial Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:col-span-2 relative"
            >
              {/* Carousel Container */}
              <div className="relative overflow-hidden px-4 md:px-0">
                <motion.div
                  className="flex gap-4 md:gap-6 pb-4"
                  animate={{ x: [0, -100 * 4] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                >
                  {[
                    { name: 'Sarah M.', title: 'Homeowner', text: 'JD Construction transformed our outdated kitchen into a modern masterpiece. The attention to detail was incredible.', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384' },
                    { name: 'Mike R.', title: 'Business Owner', text: 'Professional from start to finish. They communicated every step of the way and the quality of work exceeded our expectations.', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384' },
                    { name: 'Jennifer L.', title: 'Designer', text: 'Our bathroom remodel was completed beautifully. The team was respectful, clean, and the craftsmanship is top-notch.', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384' },
                    { name: 'Tom B.', title: 'Architect', text: 'Added a deck and outdoor living space. The design suggestions were spot-on and the construction quality is excellent.', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384' },
                    // Duplicate for seamless loop
                    { name: 'Sarah M.', title: 'Homeowner', text: 'JD Construction transformed our outdated kitchen into a modern masterpiece. The attention to detail was incredible.', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384' },
                    { name: 'Mike R.', title: 'Business Owner', text: 'Professional from start to finish. They communicated every step of the way and the quality of work exceeded our expectations.', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384' },
                    { name: 'Jennifer L.', title: 'Designer', text: 'Our bathroom remodel was completed beautifully. The team was respectful, clean, and the craftsmanship is top-notch.', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384' },
                    { name: 'Tom B.', title: 'Architect', text: 'Added a deck and outdoor living space. The design suggestions were spot-on and the construction quality is excellent.', photo: 'https://static.wixstatic.com/media/dc69ab_9fb22f17307b45a0b4759bccf4981c5e~mv2.png?originWidth=384&originHeight=384' }
                  ].map((testimonial, index) => (
                    <div key={index} className="flex-shrink-0 w-80 sm:w-96">
                      {/* Premium Dark Card */}
                      <div className="bg-[#1C1C1C] rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300">
                        {/* Stars */}
                        <div className="flex gap-1 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-[#C9A14A] fill-primary" />
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className="font-paragraph text-base text-white/90 mb-8 leading-relaxed flex-grow no-underline font-normal normal-case">
                          "{testimonial.text}"
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                          {/* Headshot */}

                          {/* Name & Title */}
                          <div>
                            <div className="font-heading text-base font-bold text-white">{testimonial.name}</div>
                            <div className="font-paragraph text-xs text-white/60">{testimonial.title}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Fade Gradient Overlay (Right) */}
              <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#F7F7F7] to-transparent pointer-events-none z-10" />
            </motion.div>
          </div>

          {/* View All Reviews Button */}
          <div className="text-center mt-12">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-heading px-8 h-12 rounded-lg">
              <a href="https://www.google.com/search?q=JD+Construction+reviews" target="_blank" rel="noopener noreferrer">
                View All Reviews
              </a>
            </Button>
          </div>
        </div>
      </section>
      {/* --- SECTION 7: CURVED CAROUSEL GALLERY --- */}
      <section className="w-full py-40 bg-white overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary font-heading font-bold tracking-widest uppercase mb-4 block text-sm">Portfolio</span>
              <h2 className="font-heading text-5xl lg:text-6xl text-secondary mb-4">
                Gallery of Work
              </h2>
              <p className="font-paragraph text-lg text-foreground/70 max-w-2xl mx-auto">
                Explore our portfolio of completed projects
              </p>
            </motion.div>
          </div>

          <InstagramFeed />

          {/* View All Link */}
          <div className="text-center mt-20">
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
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-medium-grey/10"
                >
                  <Ruler className="w-10 h-10 text-primary mb-6" />
                  <h3 className="font-heading text-xl text-secondary mb-3 font-bold">Detailed Scope</h3>
                  <p className="font-paragraph text-sm text-foreground/70">No surprises. Comprehensive plans and transparent pricing.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-medium-grey/10"
                >
                  <Users className="w-10 h-10 text-primary mb-6" />
                  <h3 className="font-heading text-xl text-secondary mb-3 font-bold">Respectful Crews</h3>
                  <p className="font-paragraph text-sm text-foreground/70">Professional teams who treat your home with care.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-medium-grey/10"
                >
                  <Award className="w-10 h-10 text-primary mb-6" />
                  <h3 className="font-heading text-xl text-secondary mb-3 font-bold">Quality Materials</h3>
                  <p className="font-paragraph text-sm text-foreground/70">Premium materials and proven techniques for lasting results.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-medium-grey/10"
                >
                  <Shield className="w-10 h-10 text-primary mb-6" />
                  <h3 className="font-heading text-xl text-secondary mb-3 font-bold">Warranty-Backed</h3>
                  <p className="font-paragraph text-sm text-foreground/70">1-year warranty on all workmanship for your peace of mind.</p>
                </motion.div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative h-[600px]">
              <div className="absolute inset-0 bg-secondary rounded-3xl transform rotate-3" />
              <div className="absolute inset-0 bg-white rounded-3xl transform -rotate-3 overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src="https://static.wixstatic.com/media/dc69ab_b55142067b434d169fb2b39b40754ad4~mv2.png"
                  alt="JD Construction Project"
                  className="w-full h-full object-cover"
                  originWidth={800}
                  originHeight={600}
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
            <div className="px-4">
              <div className="font-heading text-5xl lg:text-6xl text-primary mb-2 font-bold">100+</div>
              <div className="font-paragraph text-lg text-white/70">5-Star Reviews</div>
            </div>
            <div className="px-4">
              <div className="font-heading text-5xl lg:text-6xl text-primary mb-2 font-bold">85%</div>
              <div className="font-paragraph text-lg text-white/70">Repeat Clients</div>
            </div>
            <div className="px-4">
              <div className="font-heading text-5xl lg:text-6xl text-primary mb-2 font-bold">92%</div>
              <div className="font-paragraph text-lg text-white/70">Referral Rate</div>
            </div>
            <div className="px-4">
              <div className="font-heading text-5xl lg:text-6xl text-primary mb-2 font-bold">26</div>
              <div className="font-paragraph text-lg text-white/70">Projects This Year</div>
            </div>
          </div>
        </div>
      </section>
      {/* --- SECTION 10: TEAM PREVIEW --- */}
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
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-heading text-secondary mb-2">Name *</label>
                    <Input
                      placeholder="Your full name"
                      className="h-12 rounded-lg border-medium-grey/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-secondary mb-2">Email *</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="h-12 rounded-lg border-medium-grey/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-heading text-secondary mb-2">Phone *</label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="h-12 rounded-lg border-medium-grey/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-secondary mb-2">Zip Code *</label>
                    <Input
                      placeholder="07090"
                      className="h-12 rounded-lg border-medium-grey/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-heading text-secondary mb-2">Project Type *</label>
                    <Select required>
                      <SelectTrigger className="h-12 rounded-lg border-medium-grey/30">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kitchen">Kitchen Remodel</SelectItem>
                        <SelectItem value="bathroom">Bathroom Remodel</SelectItem>
                        <SelectItem value="addition">Home Addition</SelectItem>
                        <SelectItem value="deck">Deck/Outdoor Living</SelectItem>
                        <SelectItem value="roofing">Roofing & Siding</SelectItem>
                        <SelectItem value="flooring">Flooring & Carpentry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block font-heading text-secondary mb-2">Timeline *</label>
                    <Select required>
                      <SelectTrigger className="h-12 rounded-lg border-medium-grey/30">
                        <SelectValue placeholder="When to start?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">As soon as possible</SelectItem>
                        <SelectItem value="1-3">1-3 months</SelectItem>
                        <SelectItem value="3-6">3-6 months</SelectItem>
                        <SelectItem value="6+">6+ months</SelectItem>
                        <SelectItem value="planning">Just planning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block font-heading text-secondary mb-2">Budget Range *</label>
                  <Select required>
                    <SelectTrigger className="h-12 rounded-lg border-medium-grey/30">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-10k">Under $10,000</SelectItem>
                      <SelectItem value="10-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k+">$100,000+</SelectItem>
                      <SelectItem value="not-sure">Not sure yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block font-heading text-secondary mb-2">Project Details *</label>
                  <Textarea
                    placeholder="Tell us about your project, what you're looking to accomplish, any specific requirements..."
                    rows={6}
                    className="rounded-lg border-medium-grey/30"
                    required
                  />
                </div>

                <div>
                  <label className="block font-heading text-secondary mb-2">Photos (Optional)</label>
                  <div className="border-2 border-dashed border-medium-grey/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <p className="font-paragraph text-foreground mb-2">Drop photos here or click to upload</p>
                    <p className="font-paragraph text-sm text-foreground/70">JPG, PNG up to 10MB each</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base h-14 rounded-lg"
                >
                  Request My Quote
                </Button>

                <a href="tel:267-804-4120" className="md:hidden block">
                  <Button
                    type="button"
                    size="lg"
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading text-base h-14 rounded-lg"
                  >
                    Call Now
                  </Button>
                </a>

                <p className="text-center font-paragraph text-sm text-foreground/70">
                  * Required fields. We reply within 1 business day.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
