interface Icon3DPrivacyProps {
  size?: number;
}

export function Icon3DPrivacy({ size = 100 }: Icon3DPrivacyProps) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      {/* Shield base */}
      <div className="relative">
        {/* Shield background */}
        <div
          className="rounded-t-full bg-gradient-to-br from-green-400 to-teal-500 shadow-xl"
          style={{
            width: size * 0.7,
            height: size * 0.85,
            borderBottomLeftRadius: size * 0.35,
            borderBottomRightRadius: size * 0.35,
            boxShadow: '0 10px 30px rgba(20, 184, 166, 0.3)',
          }}
        />
        
        {/* Shield highlight */}
        <div
          className="absolute top-0 left-1/4 rounded-full bg-white/30"
          style={{
            width: size * 0.2,
            height: size * 0.25,
          }}
        />
        
        {/* Medical cross */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Vertical bar */}
            <div
              className="absolute bg-white rounded-full shadow-md"
              style={{
                width: size * 0.1,
                height: size * 0.4,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            {/* Horizontal bar */}
            <div
              className="absolute bg-white rounded-full shadow-md"
              style={{
                width: size * 0.4,
                height: size * 0.1,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
