
import React, { useRef } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { EyeIcon } from './icons/EyeIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';


interface PromptControlsProps {
  onGenerate: () => void;
  onToggleHints: () => void;
  isGenerating: boolean;
  showHints: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImages: () => void;
  hasCustomImages: boolean;
}

export const PromptControls: React.FC<PromptControlsProps> = ({ 
  onGenerate, 
  onToggleHints, 
  isGenerating, 
  showHints,
  onImageUpload,
  onClearImages,
  hasCustomImages
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-gradient-to-r from-lime-300 to-green-400 rounded-full shadow-lg hover:from-lime-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-lime-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        <SparklesIcon className="w-7 h-7 mr-3" />
        {isGenerating ? 'Generating...' : 'Generate Video Prompt'}
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={onToggleHints}
          disabled={hasCustomImages}
          title={hasCustomImages ? "Hints are only available for the default image" : ""}
          className={`col-span-1 inline-flex items-center justify-center px-6 py-3 font-semibold rounded-full shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
            showHints 
              ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500/50' 
              : 'bg-gray-700/50 text-gray-200 hover:bg-gray-600/70 focus:ring-gray-500/50'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-gray-700/50`}
        >
          <EyeIcon className="w-6 h-6 mr-2" />
          {showHints ? 'Hide' : 'Hints'}
        </button>

        <button
          onClick={handleUploadClick}
          className="col-span-1 inline-flex items-center justify-center px-6 py-3 font-semibold rounded-full shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500/50"
        >
          <UploadIcon className="w-6 h-6 mr-2" />
          Add
        </button>
        
        <button
          onClick={onClearImages}
          disabled={!hasCustomImages}
          className="col-span-1 inline-flex items-center justify-center px-6 py-3 font-semibold rounded-full shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          <XCircleIcon className="w-6 h-6 mr-2" />
          Clear
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageUpload}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        multiple
      />
    </div>
  );
};
