
import React, { useState } from 'react';
import type { UploadedImage } from './types';
import { editImageWithPrompt } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setEditedImageUrl(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!uploadedImage || !prompt.trim()) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);

    try {
      const newImageBase64 = await editImageWithPrompt(
        uploadedImage.base64,
        uploadedImage.mimeType,
        prompt
      );
      setEditedImageUrl(`data:image/png;base64,${newImageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const presetPrompts = [
    "Add a stone pathway through the middle.",
    "Fill the garden with colorful wildflowers.",
    "Add a small wooden bench under the tree.",
    "Make it a Japanese zen garden.",
    "Add a retro film filter.",
    "Remove the lawn chair.",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary-700 dark:text-primary-400">
            Gemini Garden Designer
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Upload a photo of your space and use simple text prompts to visualize your dream garden.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">1. Upload Your Space</label>
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                previewUrl={uploadedImage?.previewUrl || null}
              />
            </div>
            
            <div>
              <label htmlFor="prompt" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">2. Describe Your Vision</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Add a cherry blossom tree' or 'Replace the grass with lavender'..."
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                rows={4}
              />
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Or try an example:</p>
                <div className="flex flex-wrap gap-2">
                    {presetPrompts.map((p) => (
                        <button 
                            key={p} 
                            onClick={() => setPrompt(p)}
                            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !uploadedImage || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              {isLoading ? 'Generating...' : 'Create My Garden'}
              <SparklesIcon className="w-5 h-5"/>
            </button>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>

          {/* Display Panel */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
            <ImageDisplay 
              originalUrl={uploadedImage?.previewUrl || null}
              editedUrl={editedImageUrl}
              isLoading={isLoading}
              prompt={prompt}
            />
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Powered by Google Gemini. Design your world.</p>
      </footer>
    </div>
  );
};

export default App;
