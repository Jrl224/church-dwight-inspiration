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
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full rounded-xl shadow-lg"
                />
                {product.sustainabilityScore && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full">
                    {product.sustainabilityScore}% Sustainable
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-xl text-gray-600 mb-6">{product.brand} • {product.category}</p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

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

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">AI Generation Prompt</h4>
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