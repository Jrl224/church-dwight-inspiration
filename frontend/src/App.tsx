import React, { useState } from 'react';
import CategorySelector from './components/CategorySelector';
import ProductGrid from './components/ProductGrid';
import InspireButton from './components/InspireButton';
import ProductDetail from './components/ProductDetail';
import { useStore } from './store';
import './App.css';
import axios from 'axios';

function App() {
  const { generatedProducts, selectedProduct } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('');

  const testAPI = async () => {
    try {
      const response = await axios.get('/api/health');
      setApiStatus(`API Status: ${response.data.status} | Has OpenAI Key: ${response.data.env.hasOpenAIKey} | Key Prefix: ${response.data.env.keyPrefix}`);
    } catch (error: any) {
      setApiStatus(`API Error: ${error.message}`);
      console.error('API Test Error:', error);
    }
  };

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
        {/* API Test Button - Remove this in production */}
        <div className="mb-4 text-center">
          <button
            onClick={testAPI}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Test API Connection
          </button>
          {apiStatus && (
            <p className="mt-2 text-sm text-gray-600">{apiStatus}</p>
          )}
        </div>

        <CategorySelector />
        
        <div className="mt-8 text-center">
          <InspireButton 
            onGenerate={() => setIsGenerating(true)}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
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