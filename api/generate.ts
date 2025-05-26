import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// Initialize OpenAI
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

// Brand mapping
const brandsByCategory: Record<string, string[]> = {
  'laundry': ['ARM & HAMMER', 'OXICLEAN', 'XTRA'],
  'oral-care': ['ARM & HAMMER', 'THERABREATH', 'WATERPIK', 'SPINBRUSH', 'ORAJEL'],
  'personal-care': ['BATISTE', 'NAIR', 'FLAWLESS', 'ARM & HAMMER'],
  'health': ['VITAFUSION', 'L\'IL CRITTERS', 'ZICAM'],
  'home-care': ['ARM & HAMMER', 'KABOOM', 'OXICLEAN'],
  'pet-care': ['ARM & HAMMER'],
  'sexual-wellness': ['TROJAN', 'FIRST RESPONSE'],
};

// Pre-defined innovations for speed
const innovations = [
  { tech: 'AI-powered personalization', desc: 'adapts to your unique needs' },
  { tech: 'biodegradable capsules', desc: 'dissolves completely in water' },
  { tech: 'microbiome technology', desc: 'supports natural balance' },
  { tech: 'carbon-negative formula', desc: 'removes CO2 from atmosphere' },
  { tech: 'smart sensor technology', desc: 'tracks usage and effectiveness' },
  { tech: 'waterless concentrate', desc: 'just add water at home' },
  { tech: 'probiotic-enhanced', desc: 'promotes healthy bacteria' },
  { tech: 'plant-based enzymes', desc: '100% natural cleaning power' },
  { tech: 'zero-waste refills', desc: 'reusable forever packaging' },
  { tech: 'UV-activated formula', desc: 'powered by sunlight' },
];

function generateQuickConcept(category: string, brand: string) {
  const innovation = innovations[Math.floor(Math.random() * innovations.length)];
  const categoryClean = category.replace('-', ' ');
  
  const productNames: Record<string, string[]> = {
    'laundry': ['UltraClean', 'FreshWave', 'PureWash', 'EcoBoost', 'SmartClean'],
    'oral-care': ['SmileBright', 'FreshGuard', 'TeethShield', 'OralPure', 'MouthCare'],
    'personal-care': ['SkinGlow', 'BodyFresh', 'PureTouch', 'DermaCare', 'Refresh'],
    'health': ['VitaBoost', 'HealthPlus', 'NutriCore', 'WellnessMax', 'LifeForce'],
    'home-care': ['CleanMaster', 'HomePure', 'SparkleClean', 'FreshHome', 'PowerClean'],
    'pet-care': ['PetFresh', 'FurCare', 'PawPure', 'AnimalWell', 'PetGuard'],
    'sexual-wellness': ['IntimaCare', 'LovePlus', 'PureTouch', 'WellnessPlus', 'CareMax'],
  };
  
  const baseName = productNames[category]?.[Math.floor(Math.random() * 5)] || 'Innovation';
  const productName = `${brand} ${baseName} ${innovation.tech.split(' ')[0]}`;
  
  return {
    productName,
    innovation: innovation.tech,
    marketDisruption: `First ${categoryClean} product that ${innovation.desc}`,
    consumerInsight: `Modern consumers want ${categoryClean} products that are both effective and sustainable`,
    dallePrompt: `Professional product photography: ${brand} ${categoryClean} product bottle with ${innovation.tech}, modern minimalist packaging, white background, studio lighting, photorealistic, commercial photography`,
    features: [
      `Uses ${innovation.tech}`,
      'Clinically proven effectiveness',
      'Eco-friendly packaging'
    ],
    ingredients: `Advanced ${innovation.tech} complex`,
    usage: 'Use as directed for best results',
    price: '$19.99 - 24oz',
    sustainability: '100% recyclable packaging, carbon neutral production'
  };
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

  if (!openai) {
    return res.status(500).json({ 
      error: 'OpenAI API not configured',
      details: 'Please ensure OPENAI_API_KEY is set in environment variables'
    });
  }

  try {
    const { category, brand: requestedBrand } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    console.log('Generating for:', { category, requestedBrand });

    // Select brand
    const brand = requestedBrand || brandsByCategory[category]?.[Math.floor(Math.random() * brandsByCategory[category].length)] || 'ARM & HAMMER';
    
    // Generate concept quickly without GPT
    const concept = generateQuickConcept(category, brand);
    
    // Generate image
    console.log('Creating image...');
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: concept.dallePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural", // 'natural' is faster than 'vivid'
    });

    const images = [];
    if (imageResponse.data && imageResponse.data[0]) {
      images.push({
        id: uuidv4(),
        url: imageResponse.data[0].url,
        localPath: '',
        prompt: concept.dallePrompt,
        brand: brand,
        category: category,
        productName: concept.productName,
        innovation: concept.innovation,
        marketDisruption: concept.marketDisruption,
        consumerInsight: concept.consumerInsight,
        features: concept.features,
        ingredients: concept.ingredients,
        usage: concept.usage,
        price: concept.price,
        sustainability: concept.sustainability,
        createdAt: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      images,
      sessionId: uuidv4(),
      totalGenerated: images.length,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate',
      details: error.message
    });
  }
}