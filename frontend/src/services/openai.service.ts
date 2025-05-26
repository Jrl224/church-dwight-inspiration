import axios from 'axios';
import { Product } from '../store';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

interface GenerateProductsParams {
  category: string;
  brand?: string | null;
  count?: number;
}

export async function generateProducts(params: GenerateProductsParams): Promise<Product[]> {
  const { category, brand, count = 1 } = params; // Default to 1 for faster generation
  
  try {
    console.log('Calling API with:', { url: `${API_BASE_URL}/generate`, params });
    
    // Call backend API which will handle OpenAI GPT + DALL-E 3 generation
    const response = await axios.post(`${API_BASE_URL}/generate`, {
      category,
      brand,
      count,
    }, {
      timeout: 30000 // 30 second timeout
    });

    console.log('API Response:', response.data);

    // Transform response data into Product format
    const products: Product[] = response.data.images.map((image: any) => ({
      id: image.id,
      imageUrl: image.url,
      localPath: image.localPath || '',
      name: image.productName || image.brand + ' Innovation',
      brand: image.brand || brand || 'Church & Dwight',
      category: image.category || category,
      prompt: image.prompt,
      createdAt: new Date(image.createdAt),
      
      // New innovative fields from GPT
      productName: image.productName,
      innovation: image.innovation,
      marketDisruption: image.marketDisruption,
      consumerInsight: image.consumerInsight,
      features: image.features || [],
      ingredients: image.ingredients,
      usage: image.usage,
      price: image.price,
      sustainability: image.sustainability,
      trend: image.trend,
      
      // Generate a score if not provided
      sustainabilityScore: image.sustainabilityScore || (image.sustainability ? 85 : 70),
    }));

    return products;
  } catch (error: any) {
    console.error('Failed to generate products:', error);
    console.error('Error details:', error.response?.data);
    
    // Provide more helpful error messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    } else if (error.response?.data?.details) {
      throw new Error(error.response.data.details);
    } else if (error.response?.status === 504) {
      throw new Error('The server took too long to respond. Please try again.');
    } else if (error.response?.status === 500 && error.response?.data?.error === 'OpenAI API not configured') {
      throw new Error('The OpenAI API key is not configured. Please check server settings.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please check the console for details.');
    } else if (error.message === 'Network Error') {
      throw new Error('Cannot connect to the server. Please check if the API is running.');
    } else {
      throw error;
    }
  }
}

export async function generateVariations(productId: string): Promise<Product[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/variations/${productId}`);
    return response.data.variations;
  } catch (error) {
    console.error('Failed to generate variations:', error);
    throw error;
  }
}

export async function generateMindMap(productId: string, expansionType: string): Promise<any> {
  try {
    const response = await axios.post(`${API_BASE_URL}/mindmap/${productId}`, {
      expansionType,
    });
    return response.data.mindMapData;
  } catch (error) {
    console.error('Failed to generate mind map:', error);
    throw error;
  }
}