import { useState, useRef } from 'react';
import { Camera, Upload, ArrowLeft, ChevronRight, X } from 'lucide-react';
import { Language } from '../App';

interface ImageUploadProps {
  language: Language;
  isOnline: boolean;
  onUpload: (data: { url: string; type: 'wound' | 'skin' | 'xray' }) => void;
  onBack: () => void;
}

export function ImageUpload({ language, isOnline, onUpload, onBack }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageType, setImageType] = useState<'wound' | 'skin' | 'xray'>('wound');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        simulateUpload();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (imageUrl) {
      onUpload({ url: imageUrl, type: imageType });
    }
  };

  const clearImage = () => {
    setImageUrl(null);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h2 className="text-gray-800">Take or upload photo</h2>
          <p className="text-sm text-gray-500">फोटो लें या अपलोड करें</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 flex flex-col">
        {/* Image type selector */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">What type of image?</p>
          <div className="grid grid-cols-3 gap-2">
            {['wound', 'skin', 'xray'].map((type) => (
              <button
                key={type}
                onClick={() => setImageType(type as any)}
                className={`p-3 rounded-xl text-sm capitalize transition-all ${
                  imageType === type
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {type === 'xray' ? 'X-Ray' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Camera preview area */}
        {!imageUrl ? (
          <div className="flex-1 flex flex-col items-center justify-center mb-6">
            {/* Guidance overlay */}
            <div className="relative w-full max-w-sm aspect-square mb-8">
              <div className="absolute inset-0 border-4 border-dashed border-teal-300 rounded-3xl flex items-center justify-center bg-teal-50">
                <div className="text-center p-6">
                  <Camera className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Position the affected area</p>
                  <p className="text-sm text-gray-500">प्रभावित क्षेत्र को रखें</p>
                </div>
              </div>
              
              {/* Guidance corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-teal-500 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-teal-500 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-teal-500 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-teal-500 rounded-br-lg" />
            </div>

            {/* Tips */}
            <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-blue-800 font-medium mb-2">📸 Photo tips:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Use good lighting</li>
                <li>• Keep camera steady</li>
                <li>• Fill the frame with affected area</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={handleCameraClick}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
              >
                <Camera className="w-6 h-6" />
                <span>Take Photo</span>
              </button>
              
              <button
                onClick={handleCameraClick}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 p-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                <Upload className="w-6 h-6" />
                <span>Upload from Gallery</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Image preview */}
            <div className="relative mb-6 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full h-auto"
              />
              <button
                onClick={clearImage}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Upload progress */}
            {isUploading && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Uploading...</span>
                  <span className="text-sm text-teal-600">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-green-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Offline queue indicator */}
            {!isOnline && uploadProgress === 100 && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <p className="text-sm text-orange-800">
                  📡 Image saved. Will upload when online.
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isUploading || uploadProgress < 100}
              className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white p-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <span>Analyze Image</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
