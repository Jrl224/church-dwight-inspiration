import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../store';
import { useStore } from '../store';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { setSelectedProduct, favorites, toggleFavorite } = useStore();

  // Show single card view for latest product (Tinder-style)
  if (products.length === 1) {
    const product = products[0];
    return (
      <div className="mt-12 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.productName || product.name}
                className="w-full h-full object-cover"
              />
              
              {product.innovation && (
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {product.innovation.split(' ').slice(0, 3).join(' ')}
                </div>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <svg
                  className={`w-8 h-8 ${favorites.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
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
            
            <div className="p-6">
              <h3 className="font-bold text-2xl text-gray-900 mb-2">
                {product.productName || product.name}
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                {product.brand} • {product.category?.replace('-', ' ').toUpperCase()}
              </p>
              
              {product.marketDisruption && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">
                    🚀 {product.marketDisruption}
                  </p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="flex-1 px-6 py-3 bg-church-blue text-white rounded-lg font-semibold hover:bg-church-light-blue transition-colors"
                >
                  VIEW DETAILS
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Grid view for multiple products
  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  alt={product.productName || product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {product.innovation && (
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {product.innovation.split(' ').slice(0, 2).join(' ')}
                  </div>
                )}
                
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
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                  {product.productName || product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {product.brand} • {product.category?.replace('-', ' ').toUpperCase()}
                </p>
                
                {product.marketDisruption && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {product.marketDisruption}
                  </p>
                )}
                
                {product.sustainability && (
                  <div className="mt-3 flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${product.sustainabilityScore || 85}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.sustainabilityScore || 85}% Eco
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;