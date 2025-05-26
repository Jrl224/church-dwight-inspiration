import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../store';
import { useStore } from '../store';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { setSelectedProduct, favorites, toggleFavorite } = useStore();

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {products.slice(-9).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <svg
                    className={`w-6 h-6 ${favorites.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.brand} • {product.category}</p>
                
                {product.sustainabilityScore && (
                  <div className="mt-3 flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${product.sustainabilityScore}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.sustainabilityScore}% Eco
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Center "+" button for more variations */}
        {products.length >= 9 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     w-20 h-20 bg-church-blue text-white rounded-full shadow-xl
                     flex items-center justify-center text-3xl font-bold
                     hover:bg-church-light-blue transition-colors duration-300"
            onClick={() => {/* Generate more variations */}}
          >
            +
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;