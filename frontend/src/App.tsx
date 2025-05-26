import React, { useState } from 'react';
import CategorySelector from './components/CategorySelector';
import ProductGrid from './components/ProductGrid';
import InspireButton from './components/InspireButton';
import ProductDetail from './components/ProductDetail';
import { useStore } from './store';
import './App.css';

function App() {
  const { generatedProducts, selectedProduct } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-church-blue">CHURCH & DWIGHT</h1>
            <p className="text-xl text-gray-600 mt-2">INNOVATION INSPIRATION</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategorySelector />
        
        <div className="mt-8 text-center">
          <InspireButton 
            onGenerate={() => setIsGenerating(true)}
            isGenerating={isGenerating}
          />
        </div>

        {generatedProducts.length > 0 && (
          <ProductGrid products={generatedProducts} />
        )}

        {selectedProduct && (
          <ProductDetail product={selectedProduct} />
        )}
      </main>
    </div>
  );
}

export default App;