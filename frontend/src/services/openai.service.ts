import axios from 'axios';
import { Product } from '../store';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

interface GenerateProductsParams {
  category: string;
  brand?: string | null;
  count?: number;
}

// Generate product features based on category and trends
function generateFeatures(category: string): string[] {
  const baseFeatures = [
    'Dermatologist tested',
    '100% recyclable packaging',
    'Made with renewable energy',
    'Clinically proven effectiveness',
    'Safe for sensitive skin',
  ];

  const categoryFeatures: Record<string, string[]> = {
    'laundry': [
      'Removes 99.9% of stains',
      'Works in cold water',
      'Concentrated formula - 50% less plastic',
      'HE compatible',
      'Fresh scent lasts 30 days',
    ],
    'oral-care': [
      'Whitens teeth in 7 days',
      'Enamel safe formula',
      'Fights bad breath for 24 hours',
      'Recommended by dentists',
      'Fluoride enhanced protection',
    ],
    'personal-care': [
      'pH balanced formula',
      '48-hour protection',
      'No white residue',
      'Aluminum-free option',
      'Infused with vitamins',
    ],
    'health': [
      'Third-party tested',
      'Non-GMO verified',
      'Gluten-free formula',
      'No artificial colors',
      'Enhanced absorption',
    ],
    'home-care': [
      'Kills 99.9% of germs',
      'No harsh chemicals',
      'Safe for all surfaces',
      'Fresh scent technology',
      'Streak-free formula',
    ],
    'pet-care': [
      'Veterinarian approved',
      'Controls odor for 7 days',
      'Low dust formula',
      '99% dust free',
      'Natural ingredients',
    ],
    'sexual-wellness': [
      'FDA approved',
      'Latex-free options',
      'Hypoallergenic',
      'Precision technology',
      'Discrete packaging',
    ],
  };

  const features = [...baseFeatures];
  if (categoryFeatures[category]) {
    features.push(...categoryFeatures[category].slice(0, 3));
  }

  return features.slice(0, 5);
}

// Generate product name
function generateProductName(category: string, brand: string): string {
  const prefixes = ['Ultra', 'Pro', 'Max', 'Elite', 'Pure', 'Advanced', 'Smart', 'Eco', 'Bio'];
  const suffixes = ['Plus', 'Pro', 'X', '360', 'Complete', 'Total', 'Premium', 'Elite'];
  
  const categoryNames: Record<string, string[]> = {
    'laundry': ['Clean', 'Fresh', 'Bright', 'Power', 'Care'],
    'oral-care': ['White', 'Fresh', 'Guard', 'Pro', 'Care'],
    'personal-care': ['Smooth', 'Glow', 'Fresh', 'Care', 'Pure'],
    'health': ['Vita', 'Health', 'Boost', 'Daily', 'Complete'],
    'home-care': ['Clean', 'Fresh', 'Shine', 'Power', 'Guard'],
    'pet-care': ['Pet', 'Fresh', 'Care', 'Control', 'Guard'],
    'sexual-wellness': ['Care', 'Plus', 'Pro', 'Comfort', 'Natural'],
  };

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const middle = categoryNames[category]?.[Math.floor(Math.random() * categoryNames[category].length)] || 'Pro';
  const suffix = Math.random() > 0.5 ? suffixes[Math.floor(Math.random() * suffixes.length)] : '';

  return `${brand} ${prefix} ${middle}${suffix ? ' ' + suffix : ''}`;
}

export async function generateProducts(params: GenerateProductsParams): Promise<Product[]> {
  const { category, brand, count = 9 } = params;
  
  try {
    console.log('Calling API with:', { url: `${API_BASE_URL}/generate`, params });
    
    // Call backend API which will handle OpenAI DALL-E 3 generation
    const response = await axios.post(`${API_BASE_URL}/generate`, {
      category,
      brand,
      count,
    });

    console.log('API Response:', response.data);

    // Transform response data into Product format
    const products: Product[] = response.data.images.map((image: any) => ({
      id: image.id,
      imageUrl: image.url,
      localPath: image.localPath || '',
      name: generateProductName(category, image.brand || brand || 'Church & Dwight'),
      brand: image.brand || brand || 'Church & Dwight',
      category: category,
      features: generateFeatures(category),
      sustainabilityScore: Math.floor(Math.random() * 30) + 70, // 70-100
      prompt: image.prompt,
      createdAt: new Date(image.createdAt),
    }));

    return products;
  } catch (error: any) {
    console.error('Failed to generate products:', error);
    console.error('Error details:', error.response?.data);
    
    // Provide more helpful error messages
    if (error.response?.data?.details) {
      throw new Error(error.response.data.details);
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