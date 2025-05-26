import axios from 'axios';
import { Product } from '../store';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface GenerateProductsParams {
  category: string;
  brand?: string | null;
  count?: number;
}

// Brand mapping for Church & Dwight products
const brandsByCategory: Record<string, string[]> = {
  'laundry': ['ARM & HAMMER', 'OXICLEAN', 'XTRA'],
  'oral-care': ['ARM & HAMMER', 'THERABREATH', 'WATERPIK', 'SPINBRUSH', 'ORAJEL'],
  'personal-care': ['BATISTE', 'NAIR', 'FLAWLESS', 'ARM & HAMMER'],
  'health': ['VITAFUSION', 'L\'IL CRITTERS', 'ZICAM'],
  'home-care': ['ARM & HAMMER', 'KABOOM', 'OXICLEAN'],
  'pet-care': ['ARM & HAMMER'],
  'sexual-wellness': ['TROJAN', 'FIRST RESPONSE'],
};

// Innovation trends to incorporate
const innovationTrends = [
  'sustainable packaging',
  'plant-based formula',
  'probiotic technology',
  'AI-optimized',
  'refillable system',
  'zero waste',
  'aromatherapy infused',
  'customizable',
  'subscription-ready',
  'carbon neutral',
];

// Generate prompts for DALL-E 3
function generatePrompt(category: string, brand?: string | null): string {
  const selectedBrand = brand || brandsByCategory[category]?.[Math.floor(Math.random() * brandsByCategory[category].length)] || 'Church & Dwight';
  const trend = innovationTrends[Math.floor(Math.random() * innovationTrends.length)];
  
  const categoryPrompts: Record<string, string> = {
    'laundry': `Create a hyper-realistic product photo of an innovative ${selectedBrand} laundry detergent featuring ${trend}. Show professional packaging with clear branding, modern design, photorealistic textures, studio lighting on white background with subtle shadows. Include visible product benefits and eco-friendly badges.`,
    
    'oral-care': `Generate a photorealistic ${selectedBrand} oral care product with ${trend}. Display sleek packaging, clear brand logo, innovative features visible, medical-grade aesthetic, premium quality rendering, white background, professional product photography style.`,
    
    'personal-care': `Design a hyper-realistic ${selectedBrand} personal care product incorporating ${trend}. Show luxury packaging, clear ingredient callouts, modern minimalist design, high-end product photography, perfect lighting, white background.`,
    
    'health': `Create a photorealistic ${selectedBrand} vitamin/supplement bottle with ${trend}. Display clear nutritional information, modern pharmaceutical design, trust-inspiring packaging, studio quality rendering, white background.`,
    
    'home-care': `Generate a realistic ${selectedBrand} cleaning product featuring ${trend}. Show powerful cleaning claims, modern bottle design, clear brand identity, professional product shot, white background with reflections.`,
    
    'pet-care': `Design a photorealistic ${selectedBrand} pet product with ${trend}. Display pet-friendly packaging, clear usage instructions, premium quality appearance, studio lighting, white background.`,
    
    'sexual-wellness': `Create a tasteful, professional product photo of ${selectedBrand} wellness product with ${trend}. Elegant packaging, discrete design, pharmaceutical quality, soft lighting, white background.`,
    
    'all': generatePrompt(Object.keys(categoryPrompts)[Math.floor(Math.random() * Object.keys(categoryPrompts).length)], brand),
  };

  return categoryPrompts[category] || categoryPrompts['all'];
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
    // Call backend API which will handle OpenAI DALL-E 3 generation
    const response = await axios.post(`${API_BASE_URL}/generate`, {
      category,
      brand,
      count,
    });

    // Transform response data into Product format
    const products: Product[] = response.data.images.map((image: any) => ({
      id: image.id,
      imageUrl: image.url,
      localPath: image.localPath,
      name: generateProductName(category, image.brand || brand || 'Church & Dwight'),
      brand: image.brand || brand || 'Church & Dwight',
      category: category,
      features: generateFeatures(category),
      sustainabilityScore: Math.floor(Math.random() * 30) + 70, // 70-100
      prompt: image.prompt,
      createdAt: new Date(image.createdAt),
    }));

    return products;
  } catch (error) {
    console.error('Failed to generate products:', error);
    throw error;
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