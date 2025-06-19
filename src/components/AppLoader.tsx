
import { Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

interface AppLoaderProps {
  onDataLoaded?: (data: any) => void;
}

export const AppLoader = ({ onDataLoaded }: AppLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('Initializing application...');

  console.log('AppLoader component rendering, progress:', progress);

  useEffect(() => {
    console.log('AppLoader useEffect starting');
    
    const loadData = async () => {
      try {
        // Stage 1: Initialize
        console.log('Stage 1: Initialize');
        setProgress(10);
        setLoadingStage('Initializing application...');
        
        // Small delay to show initial stage
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Stage 2: Load Pantone data
        console.log('Stage 2: Loading Pantone data');
        setProgress(30);
        setLoadingStage('Loading Pantone color database...');
        
        // Dynamic import of the heavy Pantone data
        console.log('Importing Pantone data...');
        const { PantoneData } = await import('@/data/pantoneData');
        console.log('Pantone data imported:', PantoneData ? PantoneData.length : 'null', 'colors');
        
        setProgress(60);
        setLoadingStage('Processing color data...');
        
        // Simulate processing time for large dataset
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setProgress(80);
        setLoadingStage('Setting up interface...');
        
        // Pass the loaded data to parent
        console.log('Calling onDataLoaded with data');
        onDataLoaded?.(PantoneData);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setProgress(100);
        setLoadingStage('Ready!');
        
      } catch (error) {
        console.error('Error loading Pantone data:', error);
        setLoadingStage('Error loading data...');
        // Still call onDataLoaded with empty array to prevent infinite loading
        onDataLoaded?.([]);
      }
    };

    loadData();
  }, [onDataLoaded]);

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
            {loadingStage}
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
