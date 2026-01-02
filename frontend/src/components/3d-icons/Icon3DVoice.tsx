interface Icon3DVoiceProps {
  size?: number;
}

export function Icon3DVoice({ size = 100 }: Icon3DVoiceProps) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      {/* Base circle */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-teal-400 to-teal-500 shadow-lg"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          boxShadow: '0 8px 20px rgba(20, 184, 166, 0.3)',
        }}
      />
      
      {/* Microphone body */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className="rounded-t-full bg-gradient-to-b from-white to-gray-100 shadow-md"
          style={{
            width: size * 0.25,
            height: size * 0.35,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
        <div
          className="w-1 bg-gray-300"
          style={{ height: size * 0.1 }}
        />
        <div
          className="rounded-b-full bg-gradient-to-b from-gray-200 to-gray-300"
          style={{
            width: size * 0.15,
            height: size * 0.08,
          }}
        />
      </div>

      {/* Sound waves */}
      {[0.85, 1, 1.15].map((scale, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2 border-teal-300 animate-ping"
          style={{
            width: size * scale,
            height: size * scale,
            animationDuration: '2s',
            animationDelay: `${i * 0.3}s`,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
}
