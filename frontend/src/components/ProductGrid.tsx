import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../store';
import { useStore } from '../store';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { setSelectedProduct, favorites, toggleFavorite } = useStore();

  // Show single card view for latest product (Tinder-style)
  if (products.length === 1 || products.length > 0) {
    const product = products[products.length - 1]; // Get the latest product
    return (
      <div className="mt-12 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-md w-full"
        >
          <ProductCard
            product={product}
            onFavorite={() => toggleFavorite(product.id)}
            isFavorite={favorites.includes(product.id)}
            onClick={() => setSelectedProduct(product)}
          />
          
          {/* Action buttons below the card */}
          <div className="mt-6 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="p-4 bg-gray-100 rounded-full shadow-lg hover:bg-gray-200 transition-colors"
              title="Skip"
            >
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFavorite(product.id)}
              className={`p-4 rounded-full shadow-lg transition-colors ${
                favorites.includes(product.id) 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white hover:bg-red-50'
              }`}
              title="Love it!"
            >
              <svg 
                className={`w-8 h-8 ${
                  favorites.includes(product.id) ? 'text-white' : 'text-red-500'
                }`} 
                fill={favorites.includes(product.id) ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedProduct(product)}
              className="p-4 bg-church-blue rounded-full shadow-lg hover:bg-church-light-blue transition-colors"
              title="View Details"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.button>
          </div>
          
          {/* Swipe hint */}
          <p className="text-center mt-6 text-gray-500 text-sm">
            Tap ❤️ to save • Tap 🔵 for details • Tap ❌ to skip
          </p>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default ProductGrid;