
import { Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

export const AppLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        {/* Logo/Title */}
        <div className="space-y-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <div className="text-white text-2xl font-bold">P</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Professional Pantone Search
          </h1>
          <p className="text-gray-600">Loading color database...</p>
        </div>

        {/* Animated Loader */}
        <div className="flex justify-center">
          <Loader className="h-8 w-8 animate-spin text-blue-500" />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500">
            {progress < 30 && "Initializing application..."}
            {progress >= 30 && progress < 60 && "Loading Pantone colors..."}
            {progress >= 60 && progress < 90 && "Setting up interface..."}
            {progress >= 90 && "Almost ready..."}
          </p>
        </div>

        {/* Loading Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">2000+</div>
            <div className="text-xs text-gray-500">Pantone Colors</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">ΔE</div>
            <div className="text-xs text-gray-500">Color Matching</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">Pro</div>
            <div className="text-xs text-gray-500">Export Tools</div>
          </div>
        </div>
      </div>
    </div>
  );
};
