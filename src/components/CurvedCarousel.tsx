import React from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Projects } from '@/entities';

interface CurvedCarouselProps {
  projects: Projects[];
}

export default function CurvedCarousel({ projects }: CurvedCarouselProps) {
  // Display only the first 6 projects
  const displayedProjects = projects.slice(0, 6);

  return (
    <div className="w-full">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-0">
        {displayedProjects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: '0px 100px' }}
          >
            {/* Card */}
            <motion.div
              className="relative w-full h-[300px] rounded-[14px] overflow-hidden shadow-lg group flex flex-col cursor-pointer"
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

              {/* Content - Top */}
              <motion.div
                className="absolute top-0 left-0 right-0 p-5 transform -translate-y-1 group-hover:translate-y-0 transition-transform duration-300"
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
              </motion.div>

              {/* Soft Shadow for Depth */}
              <div className="absolute inset-0 rounded-[14px] shadow-[inset_0_0_30px_rgba(0,0,0,0.2)] pointer-events-none" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
