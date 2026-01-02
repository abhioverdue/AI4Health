import { motion } from 'framer-motion';

interface Icon3DAIAnalysisProps {
  size?: number;
}

export function Icon3DAIAnalysis({ size = 200 }: Icon3DAIAnalysisProps) {
  const nodes = [
    { x: 0.5, y: 0.2, delay: 0 },
    { x: 0.2, y: 0.5, delay: 0.2 },
    { x: 0.8, y: 0.5, delay: 0.4 },
    { x: 0.35, y: 0.8, delay: 0.6 },
    { x: 0.65, y: 0.8, delay: 0.8 },
  ];

  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      {/* Central brain/AI core */}
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-purple-400 to-purple-500 shadow-xl"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Brain pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-4xl">🧠</div>
        </div>
      </motion.div>

      {/* Connection lines */}
      <svg className="absolute inset-0" style={{ width: size, height: size }}>
        {nodes.map((node, i) => (
          <motion.line
            key={`line-${i}`}
            x1={size * 0.5}
            y1={size * 0.5}
            x2={size * node.x}
            y2={size * node.y}
            stroke="url(#gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{
              duration: 1.5,
              delay: node.delay,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Medical symbol nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute rounded-full bg-gradient-to-br from-teal-400 to-teal-500 shadow-lg flex items-center justify-center"
          style={{
            width: size * 0.15,
            height: size * 0.15,
            left: `${node.x * 100}%`,
            top: `${node.y * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: node.delay,
          }}
        >
          <motion.div
            className="text-white text-lg"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              delay: node.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {['💊', '🩺', '❤️', '🔬', '💉'][i]}
          </motion.div>
        </motion.div>
      ))}

      {/* Outer glow rings */}
      <motion.div
        className="absolute rounded-full border-2 border-purple-300"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
