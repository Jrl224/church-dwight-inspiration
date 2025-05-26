import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

const categories = [
  { id: 'laundry', name: 'LAUNDRY', icon: '🧺' },
  { id: 'oral-care', name: 'ORAL CARE', icon: '🦷' },
  { id: 'personal-care', name: 'PERSONAL CARE', icon: '🧴' },
  { id: 'health', name: 'HEALTH', icon: '💊' },
  { id: 'home-care', name: 'HOME CARE', icon: '🏠' },
  { id: 'pet-care', name: 'PET CARE', icon: '🐾' },
  { id: 'sexual-wellness', name: 'SEXUAL WELLNESS', icon: '❤️' },
  { id: 'all', name: 'ALL CATEGORIES', icon: '✨' },
];

const CategorySelector: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => setSelectedCategory(category.id)}
          className={`
            relative p-6 rounded-xl border-2 transition-all duration-300
            ${selectedCategory === category.id
              ? 'border-church-blue bg-church-blue text-white shadow-lg transform scale-105'
              : 'border-gray-200 bg-white hover:border-church-light-blue hover:shadow-md'
            }
          `}
        >
          <div className="text-3xl mb-2">{category.icon}</div>
          <div className="font-semibold text-sm">{category.name}</div>
        </motion.button>
      ))}
    </div>
  );
};

export default CategorySelector;