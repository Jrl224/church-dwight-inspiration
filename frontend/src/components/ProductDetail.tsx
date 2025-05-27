import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../store';
import { useStore } from '../store';
import MindMap from './MindMap';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { setSelectedProduct } = useStore();
  const [showMindMap, setShowMindMap] = useState(false);
  
  // Check if image is a placeholder
  const isPlaceholder = product.imageUrl?.includes('placeholder.com');
  const gradient = product.gradient || 'from-blue-400 to-purple-500';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={() => setSelectedProduct(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative">
                {isPlaceholder ? (
                  <div className={`w-full aspect-square bg-gradient-to-br ${gradient} flex items-center justify-center p-12 rounded-xl shadow-lg`}>
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-12">
                        <h3 className="text-4xl font-bold text-white mb-6">
                          {product.productName || product.name}
                        </h3>
                        <div className="bg-white/30 rounded-full px-8 py-4 inline-block">
                          <p className="text-white font-semibold text-xl">
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
                    className="w-full rounded-xl shadow-lg"
                  />
                )}
                {product.sustainability && (
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full font-semibold">
                    ECO-INNOVATION
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.productName || product.name}
                </h2>
                <p className="text-xl text-gray-600 mb-4">
                  {product.brand} • {product.category?.replace(/-/g, ' ').toUpperCase()}
                </p>
                
                {/* Innovation Tag */}
                {product.innovation && (
                  <div className="mb-6">
                    <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg inline-block">
                      <span className="font-semibold">Innovation: </span>
                      {product.innovation}
                    </div>
                  </div>
                )}

                {/* Market Disruption */}
                {product.marketDisruption && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Market Disruption</h3>
                    <p className="text-gray-700">{product.marketDisruption}</p>
                  </div>
                )}

                {/* Consumer Insight */}
                {product.consumerInsight && (
                  <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-blue-700">Consumer Insight</h3>
                    <p className="text-gray-700">{product.consumerInsight}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowMindMap(true)}
                    className="px-6 py-3 bg-church-blue text-white rounded-lg hover:bg-church-light-blue transition-colors"
                  >
                    Explore Variations
                  </button>
                  <button className="px-6 py-3 border-2 border-church-blue text-church-blue rounded-lg hover:bg-church-blue hover:text-white transition-all">
                    Export to PowerPoint
                  </button>
                  <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    Share Concept
                  </button>
                </div>
              </div>
            </div>

            {/* Infographic Section */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {/* Key Features */}
              {product.features && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h4 className="font-bold text-lg mb-4 text-blue-800">Key Features</h4>
                  <ul className="space-y-3">
                    {(Array.isArray(product.features) ? product.features : Object.entries(product.features || {})).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">
                          {Array.isArray(product.features) ? feature : `${feature[0]}: ${feature[1]}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients/Technology */}
              {product.ingredients && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <h4 className="font-bold text-lg mb-4 text-green-800">Ingredients & Technology</h4>
                  <div className="space-y-2">
                    {(Array.isArray(product.ingredients) ? product.ingredients : [product.ingredients]).map((ingredient, index) => (
                      <div key={index} className="bg-white bg-opacity-70 px-3 py-2 rounded-lg text-sm">
                        {ingredient}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage & Pricing */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <h4 className="font-bold text-lg mb-4 text-purple-800">Product Details</h4>
                {product.usage && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm text-purple-700 mb-1">Usage</h5>
                    <p className="text-gray-700 text-sm">{product.usage}</p>
                  </div>
                )}
                {product.price && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm text-purple-700 mb-1">Price & Size</h5>
                    <p className="text-gray-700 text-sm">{product.price}</p>
                  </div>
                )}
                {product.sustainability && (
                  <div>
                    <h5 className="font-semibold text-sm text-purple-700 mb-1">Sustainability</h5>
                    <p className="text-gray-700 text-sm">{product.sustainability}</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Generation Info */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">AI Generation Details</h4>
              <p className="text-sm text-gray-600 italic">{product.prompt}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {showMindMap && (
        <MindMap product={product} onClose={() => setShowMindMap(false)} />
      )}
    </AnimatePresence>
  );
};

export default ProductDetail;