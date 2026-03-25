import { motion } from 'framer-motion';

export function TimelineSkeleton() {
  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />

      {/* Skeleton items */}
      <div className="space-y-8 md:space-y-12">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className={`relative flex items-start gap-6 md:gap-0 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Dot */}
            <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-white/10 md:-translate-x-1/2 z-10" />

            {/* Card */}
            <div className={`ml-10 md:ml-0 md:w-[45%] ${
              index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
            }`}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                className="glass rounded-2xl overflow-hidden"
              >
                {/* Image skeleton */}
                <div className="aspect-video bg-white/5" />
                
                {/* Content skeleton */}
                <div className="p-5 space-y-3">
                  <div className="h-6 w-3/4 bg-white/10 rounded" />
                  <div className="h-4 w-1/2 bg-white/5 rounded" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-5/6 bg-white/5 rounded" />
                  </div>
                  <div className="h-3 w-1/3 bg-white/5 rounded pt-2" />
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
