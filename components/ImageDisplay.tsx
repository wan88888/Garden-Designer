
import React from 'react';
import Loader from './Loader';
import { DownloadIcon } from './icons';

interface ImageDisplayProps {
  originalUrl: string | null;
  editedUrl: string | null;
  isLoading: boolean;
  prompt: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalUrl, editedUrl, isLoading, prompt }) => {
  const downloadImage = () => {
    if (editedUrl) {
      const link = document.createElement('a');
      link.href = editedUrl;
      const sanitizedPrompt = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 30);
      link.download = `garden_design_${sanitizedPrompt}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Original</h3>
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
          {originalUrl ? (
            <img src={originalUrl} alt="Original" className="w-full h-full object-cover" />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Upload an image to start</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Edited</h3>
        <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center relative">
          {isLoading && <Loader />}
          {!isLoading && editedUrl && (
            <>
              <img src={editedUrl} alt="Edited" className="w-full h-full object-cover" />
              <button
                onClick={downloadImage}
                className="absolute bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform hover:scale-105"
                aria-label="Download edited image"
              >
                <DownloadIcon className="h-6 w-6" />
              </button>
            </>
          )}
           {!isLoading && !editedUrl && (
            <p className="text-gray-500 dark:text-gray-400 text-center px-4">Your edited garden design will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;
