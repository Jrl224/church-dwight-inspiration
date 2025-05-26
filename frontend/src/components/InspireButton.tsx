import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateProducts } from '../services/openai.service';
import { useStore } from '../store';

interface InspireButtonProps {
  onGenerate: () => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const InspireButton: React.FC<InspireButtonProps> = ({ onGenerate, isGenerating, setIsGenerating }) => {
  const { selectedCategory, selectedBrand, addGeneratedProducts, setSessionId } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleGenerate = async () => {
    if (!selectedCategory) {
      setError('Please select a category first');
      return;
    }

    setError(null);
    setProgress('Creating innovative concept...');
    onGenerate();
    setIsGenerating(true);

    try {
      setTimeout(() => setProgress('Generating product image...'), 1000);
      
      const products = await generateProducts({
        category: selectedCategory,
        brand: selectedBrand,
        count: 1,
      });

      if (products.length > 0) {
        setSessionId(products[0].id);
      }

      addGeneratedProducts(products);
      setProgress('');
    } catch (error: any) {
      console.error('Generation error:', error);
      setError(error.message || 'Failed to generate products. Please try again.');
      setProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="text-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGenerate}
        disabled={isGenerating || !selectedCategory}
        className={`
          px-12 py-4 rounded-full text-white font-bold text-xl
          shadow-lg transition-all duration-300
          ${isGenerating || !selectedCategory
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-church-blue hover:bg-church-light-blue hover:shadow-xl'
          }
        `}
      >
        {isGenerating ? (
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>GENERATING INNOVATION...</span>
          </div>
        ) : (
          'INSPIRE ME!'
        )}
      </motion.button>
      
      {progress && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-gray-600 italic"
        >
          {progress}
        </motion.p>
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
      
      {!selectedCategory && (
        <p className="mt-3 text-sm text-gray-500">
          Select a category above to start generating ideas
        </p>
      )}
      
      <p className="mt-4 text-xs text-gray-400">
        Powered by DALL-E 3 • Instant innovation generation
      </p>
    </div>
  );
};

export default InspireButton;