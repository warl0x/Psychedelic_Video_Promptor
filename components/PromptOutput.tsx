
import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface PromptOutputProps {
  prompt: string;
  isLoading: boolean;
  error: string;
}

const LoadingIndicator: React.FC = () => (
  <div className="text-center space-y-4 p-8">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lime-400 mx-auto"></div>
    <p className="text-lg font-semibold text-gray-300 animate-pulse">Consulting the digital cosmos...</p>
    <p className="text-sm text-gray-400">Please wait, this can take a moment.</p>
  </div>
);

export const PromptOutput: React.FC<PromptOutputProps> = ({ prompt, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
    }
  };

  return (
    <div className="relative flex-grow min-h-[250px] bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg">
      {isLoading && <LoadingIndicator />}

      {error && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-red-400 font-bold text-lg">An Error Occurred</p>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      )}

      {!isLoading && !error && !prompt && (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
          <p className="text-xl font-fredoka">Your prompt will appear here.</p>
          <p>Click "Generate Video Prompt" to start the magic!</p>
        </div>
      )}

      {prompt && (
        <>
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 rounded-full bg-lime-400/20 text-lime-300 hover:bg-lime-400/40 transition-colors duration-200"
            title="Copy to clipboard"
          >
            {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
          </button>
          <div className="prose prose-invert prose-p:text-gray-200 prose-headings:text-lime-300 text-left h-full overflow-y-auto">
            <h3 className="font-fredoka">Generated Prompt:</h3>
            <p className="whitespace-pre-wrap">{prompt}</p>
          </div>
        </>
      )}
    </div>
  );
};
