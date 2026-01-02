interface Icon3DFacilityProps {
  size?: number;
}

export function Icon3DFacility({ size = 40 }: Icon3DFacilityProps) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      {/* Building */}
      <div
        className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg shadow-md relative"
        style={{
          width: size * 0.7,
          height: size * 0.8,
        }}
      >
        {/* Roof */}
        <div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-red-400 to-red-500"
          style={{
            width: size * 0.8,
            height: size * 0.25,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
        
        {/* Cross */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white text-xs">
          +
        </div>
      </div>
    </div>
  );
}
