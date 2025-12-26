
import React, { useState, useCallback } from 'react';
import { ImageDisplay } from './components/ImageDisplay';
import { PromptControls } from './components/PromptControls';
import { PromptOutput } from './components/PromptOutput';
import { generateVideoPrompt } from './services/geminiService';
import { urlToBase64, dataUrlToBase64 } from './utils/imageUtils';

const IMAGE_URLS = {
  main: 'https://i.redd.it/sbg1y1t3b7jc1.jpeg',
  hints: [
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
    'https://preview.redd.it/give-me-a-video-prompt-for-this-image-here-is-the-original-v0-sbg1y1t3b7jc1.jpeg?width=640&crop=smart&auto=webp&s=6f23e206013e8d254f165a2d640989f6671c6676',
  ].filter((url, index, self) => self.indexOf(url) === index), // Filter out duplicate URLs
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showHints, setShowHints] = useState<boolean>(false);
  const [customImages, setCustomImages] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setShowHints(false); // Hide hints when custom images are added
      const filePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then(newImages => {
        setCustomImages(prev => [...prev, ...newImages]);
      });
    }
     // Reset file input to allow uploading the same file again
    event.target.value = '';
  };
  
  const handleRemoveCustomImage = (indexToRemove: number) => {
    setCustomImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClearImages = () => {
    setCustomImages([]);
  };

  const handleGeneratePrompt = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');

    try {
      let mainImageBase64: string;
      let hintImagesBase64: string[] = [];

      if (customImages.length > 0) {
        const allCustomImagesBase64 = customImages.map(dataUrlToBase64);
        mainImageBase64 = allCustomImagesBase64[0];
        hintImagesBase64 = allCustomImagesBase64.slice(1);
      } else {
        mainImageBase64 = await urlToBase64(IMAGE_URLS.main);
        hintImagesBase64 = await Promise.all(
          IMAGE_URLS.hints.map(url => urlToBase64(url))
        );
      }
      
      const prompt = await generateVideoPrompt(mainImageBase64, hintImagesBase64);
      setGeneratedPrompt(prompt);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [customImages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-teal-400 to-purple-500 tracking-wider">
            Psychedelic Prompt Generator
          </h1>
          <p className="text-lg text-gray-300 mt-2">Let AI craft a mind-bending video prompt from your image ingredients.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ImageDisplay
            defaultMainImageSrc={IMAGE_URLS.main}
            defaultHintImagesSrc={IMAGE_URLS.hints}
            showHints={showHints && customImages.length === 0}
            customImages={customImages}
            onRemoveCustomImage={handleRemoveCustomImage}
          />
          <div className="flex flex-col gap-6">
            <PromptControls
              onGenerate={handleGeneratePrompt}
              onToggleHints={() => setShowHints(!showHints)}
              isGenerating={isLoading}
              showHints={showHints}
              onImageUpload={handleImageUpload}
              onClearImages={handleClearImages}
              hasCustomImages={customImages.length > 0}
            />
            <PromptOutput
              prompt={generatedPrompt}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
