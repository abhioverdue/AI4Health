interface Icon3DClinicProps {
  size?: number;
}

export function Icon3DClinic({ size = 200 }: Icon3DClinicProps) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-end justify-center">
      {/* Ground/base */}
      <div
        className="absolute bottom-0 w-full bg-gradient-to-b from-green-100 to-green-200 rounded-full"
        style={{ height: size * 0.05 }}
      />
      
      {/* Main building */}
      <div className="relative" style={{ marginBottom: size * 0.05 }}>
        {/* Building body */}
        <div
          className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-t-lg shadow-lg relative"
          style={{
            width: size * 0.5,
            height: size * 0.5,
            borderBottomLeftRadius: size * 0.02,
            borderBottomRightRadius: size * 0.02,
          }}
        >
          {/* Roof */}
          <div
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-red-400 to-red-500 shadow-md"
            style={{
              width: size * 0.6,
              height: size * 0.15,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
          
          {/* Medical cross sign */}
          <div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg flex items-center justify-center"
            style={{
              width: size * 0.2,
              height: size * 0.2,
            }}
          >
            <div className="relative">
              <div
                className="absolute bg-red-500 rounded-sm"
                style={{
                  width: size * 0.04,
                  height: size * 0.14,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <div
                className="absolute bg-red-500 rounded-sm"
                style={{
                  width: size * 0.14,
                  height: size * 0.04,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </div>
          
          {/* Door */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-teal-600 to-teal-700 rounded-t-lg"
            style={{
              width: size * 0.15,
              height: size * 0.25,
            }}
          />
          
          {/* Windows */}
          <div className="absolute top-8 left-2 flex gap-2">
            <div
              className="bg-blue-200 rounded"
              style={{ width: size * 0.08, height: size * 0.08 }}
            />
          </div>
          <div className="absolute top-8 right-2 flex gap-2">
            <div
              className="bg-blue-200 rounded"
              style={{ width: size * 0.08, height: size * 0.08 }}
            />
          </div>
        </div>
        
        {/* Health worker figure */}
        <div
          className="absolute -right-8 bottom-0 flex flex-col items-center"
          style={{ transform: 'scale(0.8)' }}
        >
          {/* Head */}
          <div
            className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-full mb-1"
            style={{ width: size * 0.08, height: size * 0.08 }}
          />
          {/* Body */}
          <div
            className="bg-gradient-to-b from-teal-400 to-teal-500 rounded-lg"
            style={{ width: size * 0.12, height: size * 0.15 }}
          />
        </div>
      </div>
    </div>
  );
}
