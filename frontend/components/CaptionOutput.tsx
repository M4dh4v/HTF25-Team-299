import React, { useState } from 'react';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';

interface CaptionOutputProps {
  captions: string[];
  isLoading: boolean;
}

const CaptionOutput: React.FC<CaptionOutputProps> = ({ captions, isLoading }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const Skeleton = () => (
    <div className="animate-pulse space-y-3">
        <div className="bg-gray-700 h-4 w-5/6 rounded"></div>
        <div className="bg-gray-700 h-4 w-full rounded"></div>
        <div className="bg-gray-700 h-4 w-3/4 rounded"></div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-xl p-6 h-full">
      <h2 className="text-xl font-bold mb-4 text-white">Generated Captions</h2>
      <div className="h-full max-h-[calc(100vh-250px)] overflow-y-auto pr-2 space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} />)
        ) : captions.length > 0 ? (
          captions.map((caption, index) => (
            <div key={index} className="bg-gray-700/50 rounded-lg p-4 relative transition-all duration-300">
              <p className="text-gray-200 whitespace-pre-wrap pr-8">{caption}</p>
              <button
                  onClick={() => handleCopy(caption, index)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                  aria-label="Copy caption"
              >
                  {copiedIndex === index ? <CheckIcon className="text-green-400" /> : <CopyIcon />}
              </button>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500">
            <p>Your generated captions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptionOutput;