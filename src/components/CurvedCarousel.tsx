import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  id: string;
  projectTitle: string;
  category: string;
  scopeOfWork: string;
  beforeImage: string;
}

interface CurvedCarouselProps {
  projects: Project[];
}

export default function CurvedCarousel({ projects }: CurvedCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const cardWidth = 320;
  const cardGap = 24;
  const cardTotalWidth = cardWidth + cardGap;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = cardTotalWidth;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    
    setScrollPosition(newPosition);
    scrollContainerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    e.preventDefault();
    
    const newPosition = scrollPosition + (e.deltaY > 0 ? cardTotalWidth : -cardTotalWidth);
    const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
    
    setScrollPosition(Math.max(0, Math.min(newPosition, maxScroll)));
    scrollContainerRef.current.scrollTo({
      left: Math.max(0, Math.min(newPosition, maxScroll)),
      behavior: 'smooth',
    });
  };

  const handleScrollEvent = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollEvent);
      return () => container.removeEventListener('scroll', handleScrollEvent);
    }
  }, []);

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current 
    ? scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
    : false;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Gallery Container */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto overflow-y-hidden scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
        onWheel={handleWheel}
      >
        {/* Cards Container */}
        <div className="relative w-full h-[420px] mx-auto">
          <div className="flex gap-6 px-8 py-0 h-full items-center">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="flex-shrink-0"
                style={{ width: `${cardWidth}px` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: '0px 100px' }}
              >
                {/* Card */}
                <motion.div
                  className="relative w-full h-full rounded-[14px] overflow-hidden shadow-lg group flex flex-col cursor-pointer"
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image */}
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={project.beforeImage}
                      alt={project.projectTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                  {/* Content - Bottom */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Category Badge */}
                    <div className="mb-2 inline-block">
                      <span className="px-2.5 py-1 bg-primary text-white text-xs font-heading uppercase tracking-wider rounded-md shadow-md">
                        {project.category}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-heading text-base text-white mb-1 font-bold leading-tight line-clamp-2">
                      {project.projectTitle}
                    </h3>

                    {/* Project Description */}
                    <p className="font-paragraph text-white/80 text-xs line-clamp-2">
                      {project.scopeOfWork}
                    </p>
                  </motion.div>

                  {/* Soft Shadow for Depth */}
                  <div className="absolute inset-0 rounded-[14px] shadow-[inset_0_0_30px_rgba(0,0,0,0.2)] pointer-events-none" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {canScrollLeft && (
        <motion.button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-primary hover:text-white text-secondary p-3 rounded-full shadow-lg transition-all duration-300 ml-2"
          aria-label="Scroll left"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      )}

      {canScrollRight && (
        <motion.button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-primary hover:text-white text-secondary p-3 rounded-full shadow-lg transition-all duration-300 mr-2"
          aria-label="Scroll right"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
