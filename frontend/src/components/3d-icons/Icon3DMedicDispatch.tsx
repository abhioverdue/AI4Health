interface Icon3DMedicDispatchProps {
  size?: number;
}

export function Icon3DMedicDispatch({ size = 64 }: Icon3DMedicDispatchProps) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      {/* Ambulance body */}
      <div className="relative">
        {/* Main body */}
        <div
          className="bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg relative"
          style={{
            width: size * 0.8,
            height: size * 0.5,
          }}
        >
          {/* Red stripe */}
          <div
            className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-red-600 rounded-t-lg"
            style={{ height: size * 0.15 }}
          />
          
          {/* Medical cross */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div
                className="absolute bg-red-500 rounded-sm"
                style={{
                  width: size * 0.05,
                  height: size * 0.2,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <div
                className="absolute bg-red-500 rounded-sm"
                style={{
                  width: size * 0.2,
                  height: size * 0.05,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </div>
          
          {/* Wheels */}
          <div
            className="absolute -bottom-2 left-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full shadow-md"
            style={{ width: size * 0.15, height: size * 0.15 }}
          />
          <div
            className="absolute -bottom-2 right-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full shadow-md"
            style={{ width: size * 0.15, height: size * 0.15 }}
          />
          
          {/* Light beacon */}
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-blue-400 rounded-full animate-pulse"
            style={{ width: size * 0.1, height: size * 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}
