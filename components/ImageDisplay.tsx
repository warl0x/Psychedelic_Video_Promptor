
import React from 'react';
import { XIcon } from './icons/XIcon';

interface ImageDisplayProps {
  defaultMainImageSrc: string;
  defaultHintImagesSrc: string[];
  showHints: boolean;
  customImages: string[];
  onRemoveCustomImage: (index: number) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  defaultMainImageSrc, 
  defaultHintImagesSrc, 
  showHints,
  customImages,
  onRemoveCustomImage,
}) => {
  const hasCustomImages = customImages.length > 0;

  return (
    <div className="space-y-6">
      {!hasCustomImages ? (
        <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-lime-500/20">
          <img 
            src={defaultMainImageSrc} 
            alt="Psychedelic artwork default" 
            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      ) : (
        <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
          <h3 className="text-xl font-fredoka text-center mb-4 text-lime-300">Your Ingredients</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {customImages.map((src, index) => (
              <div key={index} className="relative aspect-square group">
                <img 
                  src={src} 
                  alt={`Custom ingredient ${index + 1}`} 
                  className="w-full h-full object-cover rounded-lg border-2 border-transparent group-hover:border-lime-400 transition-colors"
                />
                <button
                  onClick={() => onRemoveCustomImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-110"
                  title="Remove image"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showHints && !hasCustomImages && (
        <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
          <h3 className="text-xl font-fredoka text-center mb-4 text-lime-300">Detailed Views</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {defaultHintImagesSrc.map((src, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg transition-transform duration-300 hover:scale-110 hover:z-10">
                <img 
                  src={src} 
                  alt={`Hint image ${index + 1}`} 
                  className="w-full h-full object-cover border-2 border-transparent hover:border-lime-400"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
