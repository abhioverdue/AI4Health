import { motion } from 'framer-motion';

interface Icon3DNavigationProps {
  size?: number;
}

export function Icon3DNavigation({ size = 120 }: Icon3DNavigationProps) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      {/* Map background */}
      <div
        className="absolute rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 shadow-lg overflow-hidden"
        style={{
          width: size * 0.9,
          height: size * 0.9,
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border border-blue-200/30" />
          ))}
        </div>
        
        {/* Road path */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.path
            d={`M ${size * 0.1} ${size * 0.1} Q ${size * 0.4} ${size * 0.3}, ${size * 0.7} ${size * 0.7}`}
            stroke="#14b8a6"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </svg>
      </div>

      {/* Starting point (hospital) */}
      <div
        className="absolute bg-red-500 rounded-full shadow-lg flex items-center justify-center"
        style={{
          width: size * 0.15,
          height: size * 0.15,
          left: size * 0.1,
          top: size * 0.1,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <span className="text-white text-xs">🏥</span>
      </div>

      {/* Destination point */}
      <div
        className="absolute bg-blue-500 rounded-full shadow-lg flex items-center justify-center"
        style={{
          width: size * 0.15,
          height: size * 0.15,
          right: size * 0.1,
          bottom: size * 0.1,
          transform: 'translate(50%, 50%)',
        }}
      >
        <span className="text-white text-xs">📍</span>
      </div>

      {/* Moving vehicle */}
      <motion.div
        className="absolute bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center"
        style={{
          width: size * 0.12,
          height: size * 0.12,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          offsetPath: `path('M ${size * 0.1} ${size * 0.1} Q ${size * 0.4} ${size * 0.3}, ${size * 0.7} ${size * 0.7}')`,
        }}
      >
        <span className="text-white text-xs">🚑</span>
      </motion.div>

      {/* GPS signal waves */}
      <motion.div
        className="absolute rounded-full border-2 border-teal-400"
        style={{
          width: size * 0.5,
          height: size * 0.5,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </div>
  );
}
