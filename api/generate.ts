import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// Initialize OpenAI with better error handling
let openai: OpenAI | null = null;

try {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.error('Failed to initialize OpenAI:', error);
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

// Innovation trends
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
  };

  // Handle 'all' category by randomly selecting another category
  if (category === 'all') {
    const categories = Object.keys(categoryPrompts);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return generatePrompt(randomCategory, brand);
  }

  return categoryPrompts[category] || categoryPrompts['laundry']; // Default to laundry if category not found
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if OpenAI is initialized
  if (!openai) {
    console.error('OpenAI client not initialized');
    return res.status(500).json({ 
      error: 'OpenAI API not configured',
      details: 'Please ensure OPENAI_API_KEY is set in environment variables'
    });
  }

  try {
    const { category, brand, count = 1 } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    console.log('Generating images for:', { category, brand, count });

    const images = [];
    
    // Generate multiple images (limit to 1 for now to save costs during testing)
    for (let i = 0; i < Math.min(count, 1); i++) {
      const prompt = generatePrompt(category, brand);
      console.log('Using prompt:', prompt);
      
      try {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard", // Use standard quality for testing
          style: "vivid",
        });

        if (response.data && response.data[0]) {
          images.push({
            id: uuidv4(),
            url: response.data[0].url,
            localPath: '', // Not used in Vercel deployment
            prompt: prompt,
            brand: brand || brandsByCategory[category]?.[0] || 'Church & Dwight',
            createdAt: new Date().toISOString(),
          });
        }
      } catch (imageError: any) {
        console.error('Error generating individual image:', imageError);
        // Continue with other images if one fails
      }
    }

    if (images.length === 0) {
      throw new Error('No images were generated successfully');
    }

    // Generate session ID if needed
    const sessionId = req.headers['x-session-id'] as string || uuidv4();

    return res.status(200).json({
      images,
      sessionId,
    });
  } catch (error: any) {
    console.error('Error in generate handler:', error);
    
    // Provide more detailed error information
    if (error.response) {
      // OpenAI API error
      return res.status(500).json({ 
        error: 'OpenAI API error',
        details: error.response.data?.error?.message || error.message,
        code: error.response.status
      });
    } else if (error.request) {
      // Network error
      return res.status(500).json({ 
        error: 'Network error connecting to OpenAI',
        details: 'Please check your internet connection'
      });
    } else {
      // Other error
      return res.status(500).json({ 
        error: 'Failed to generate images',
        details: error.message || 'Unknown error occurred'
      });
    }
  }
}