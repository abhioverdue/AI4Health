import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  isActive: boolean;
}

export function VoiceWaveform({ isActive }: VoiceWaveformProps) {
  const bars = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1 h-20">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-gradient-to-t from-teal-500 to-teal-300 rounded-full"
          animate={{
            height: isActive
              ? [
                  Math.random() * 40 + 10,
                  Math.random() * 60 + 20,
                  Math.random() * 40 + 10,
                ]
              : 10,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: bar * 0.02,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
