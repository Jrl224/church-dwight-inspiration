import React from 'react';
import { Product } from '../store';

interface ProductCardProps {
  product: Product;
  onFavorite: () => void;
  isFavorite: boolean;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onFavorite, isFavorite, onClick }) => {
  // Extract gradient colors if available
  const gradient = product.gradient || 'from-blue-400 to-purple-500';
  
  // Check if image is a placeholder
  const isPlaceholder = product.imageUrl?.includes('placeholder.com');
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Product Image/Gradient */}
      <div className="aspect-square relative overflow-hidden cursor-pointer" onClick={onClick}>
        {product.imageUrl ? (
          isPlaceholder ? (
            // Enhanced placeholder design
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center p-8`}>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {product.productName || product.name}
                  </h3>
                  <div className="bg-white/30 rounded-full px-6 py-3 inline-block">
                    <p className="text-white font-semibold text-lg">
                      {product.innovation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={product.imageUrl}
              alt={product.productName || product.name}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center p-8`}>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  {product.productName || product.name}
                </h3>
                <div className="bg-white/30 rounded-full px-6 py-3 inline-block">
                  <p className="text-white font-semibold text-lg">
                    {product.innovation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {product.innovation && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            {product.innovation.split(' ').slice(0, 3).join(' ')}
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <svg
            className={`w-8 h-8 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
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
          {product.brand} • {product.category?.replace(/-/g, ' ').toUpperCase()}
        </p>
        
        {product.marketDisruption && (
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-800 font-medium">
              🚀 {product.marketDisruption}
            </p>
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={onClick}
            className="flex-1 px-6 py-3 bg-church-blue text-white rounded-lg font-semibold hover:bg-church-light-blue transition-colors"
          >
            VIEW DETAILS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;