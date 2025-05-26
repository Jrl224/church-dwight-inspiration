import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../store';

interface MindMapProps {
  product: Product;
  onClose: () => void;
}

const MindMap: React.FC<MindMapProps> = ({ product, onClose }) => {
  const variations = [
    { type: 'Scents', items: ['Lavender Breeze', 'Ocean Fresh', 'Citrus Burst', 'Mountain Air'] },
    { type: 'Sizes', items: ['Travel Size', 'Family Pack', 'Bulk Economy', 'Single Use'] },
    { type: 'Formulas', items: ['Sensitive Skin', 'Extra Strength', 'Natural Organic', 'Hypoallergenic'] },
    { type: 'Packaging', items: ['Refillable', 'Biodegradable', 'Concentrated', 'Zero Waste'] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-center mb-8">Product Variation Explorer</h3>
        
        <div className="relative">
          {/* Central Product */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-32 h-32 rounded-full bg-church-blue flex items-center justify-center shadow-xl">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          </div>

          {/* Variation Branches */}
          <svg className="w-full h-[500px]" viewBox="0 0 800 500">
            {variations.map((variation, index) => {
              const angle = (index * 90) * Math.PI / 180;
              const centerX = 400;
              const centerY = 250;
              const radius = 200;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);

              return (
                <g key={variation.type}>
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <circle cx={x} cy={y} r="60" fill="#F3F4F6" />
                  <text x={x} y={y} textAnchor="middle" className="fill-gray-700 font-semibold">
                    {variation.type}
                  </text>
                  
                  {variation.items.map((item, itemIndex) => {
                    const itemAngle = angle + (itemIndex - 1.5) * 0.2;
                    const itemRadius = radius + 100;
                    const itemX = centerX + itemRadius * Math.cos(itemAngle);
                    const itemY = centerY + itemRadius * Math.sin(itemAngle);
                    
                    return (
                      <g key={item}>
                        <line
                          x1={x}
                          y1={y}
                          x2={itemX}
                          y2={itemY}
                          stroke="#E5E7EB"
                          strokeWidth="1"
                        />
                        <circle cx={itemX} cy={itemY} r="40" fill="#DBEAFE" />
                        <text
                          x={itemX}
                          y={itemY}
                          textAnchor="middle"
                          className="fill-gray-600 text-sm"
                        >
                          {item}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        <button
          onClick={onClose}
          className="mt-8 mx-auto block px-6 py-3 bg-church-blue text-white rounded-lg hover:bg-church-light-blue transition-colors"
        >
          Close Explorer
        </button>
      </motion.div>
    </motion.div>
  );
};

export default MindMap;