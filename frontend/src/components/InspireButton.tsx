import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { generateProducts } from '../services/openai.service';

interface InspireButtonProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

const InspireButton: React.FC<InspireButtonProps> = ({ onGenerate, isGenerating }) => {
  const { selectedCategory, selectedBrand, addGeneratedProducts } = useStore();

  const handleClick = async () => {
    if (!selectedCategory) {
      alert('Please select a category first!');
      return;
    }

    onGenerate();
    
    try {
      const products = await generateProducts({
        category: selectedCategory,
        brand: selectedBrand,
        count: 9
      });
      
      addGeneratedProducts(products);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate products. Please try again.');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={isGenerating || !selectedCategory}
      className={`
        px-12 py-6 rounded-full text-2xl font-bold shadow-xl
        transition-all duration-300 transform
        ${isGenerating
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-church-blue to-church-light-blue text-white hover:shadow-2xl'
        }
      `}
    >
      {isGenerating ? (
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          <span>GENERATING INSPIRATION...</span>
        </div>
      ) : (
        'INSPIRE ME!'
      )}
    </motion.button>
  );
};

export default InspireButton;