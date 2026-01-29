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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalCards = projects.length;
  const radius = 800; // Radius of the arc
  const angleSlice = (Math.PI * 0.6) / (totalCards - 1); // Spread cards across 108 degrees

  // Calculate position for each card on the arc
  const getCardPosition = (index: number) => {
    const position = (index - currentIndex + totalCards) % totalCards;
    const angle = (position - (totalCards - 1) / 2) * angleSlice;
    
    const x = Math.sin(angle) * radius;
    const z = (Math.cos(angle) - 1) * radius * 0.5;
    const rotateY = -angle * (180 / Math.PI);
    
    // Scale and opacity based on position
    let scale = 1;
    let opacity = 1;
    
    if (position === Math.floor((totalCards - 1) / 2)) {
      // Center card
      scale = 1;
      opacity = 1;
    } else if (position === Math.floor((totalCards - 1) / 2) - 1 || position === Math.ceil((totalCards - 1) / 2) + 1) {
      // Adjacent cards
      scale = 0.92;
      opacity = 0.95;
    } else if (position === 0 || position === totalCards - 1) {
      // Outer cards
      scale = 0.85;
      opacity = 0.8;
    } else {
      scale = 0.8;
      opacity = 0.7;
    }

    return { x, z, rotateY, scale, opacity };
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const offset = e.clientX - dragStart;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
    setDragOffset(0);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, dragOffset]);

  return (
    <div className="relative w-full h-[600px]">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative h-full flex items-start justify-center overflow-hidden cursor-grab active:cursor-grabbing pt-8"
        onMouseDown={handleMouseDown}
        style={{ perspective: '1200px' }}
      >
        {/* Cards */}
        <div className="relative w-full h-full">
          {projects.map((project, index) => {
            const { x, z, rotateY, scale, opacity } = getCardPosition(index);
            const isCenter = (index - currentIndex + totalCards) % totalCards === Math.floor((totalCards - 1) / 2);

            return (
              <motion.div
                key={project.id}
                className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  x: x + (isDragging ? dragOffset * 0.3 : 0),
                  y: 0,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  zIndex: isCenter ? 50 : Math.floor((totalCards - 1) / 2) - Math.abs((index - currentIndex + totalCards) % totalCards - Math.floor((totalCards - 1) / 2)),
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  duration: 0.6,
                }}
                style={{
                  width: '320px',
                  height: '420px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Card */}
                <motion.div
                  className="relative w-full h-full rounded-[14px] overflow-hidden shadow-lg group flex flex-col"
                  whileHover={isCenter ? { y: -12 } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image - Top */}
                  <div className="flex-shrink-0 h-1/2 overflow-hidden">
                    <Image
                      src={project.beforeImage}
                      alt={project.projectTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Content - Bottom Left */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Category Badge */}
                    <div className="mb-3 inline-block">
                      <span className="px-3 py-1 bg-primary text-white text-xs font-heading uppercase tracking-wider rounded-md shadow-md">
                        {project.category}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-heading text-lg text-white mb-2 font-bold leading-tight">
                      {project.projectTitle}
                    </h3>

                    {/* Project Description */}
                    <p className="font-paragraph text-white/85 text-sm line-clamp-2">
                      {project.scopeOfWork}
                    </p>
                  </motion.div>

                  {/* Soft Shadow for Depth */}
                  <div className="absolute inset-0 rounded-[14px] shadow-[inset_0_0_30px_rgba(0,0,0,0.2)] pointer-events-none" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-primary hover:text-white text-secondary p-3 rounded-full shadow-lg transition-all duration-300 -ml-6 lg:-ml-12"
        aria-label="Previous project"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-primary hover:text-white text-secondary p-3 rounded-full shadow-lg transition-all duration-300 -mr-6 lg:-mr-12"
        aria-label="Next project"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="flex gap-2 justify-center mt-8">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-primary w-8' : 'bg-medium-grey w-2 hover:bg-primary/60'
            }`}
            aria-label={`Go to project ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
