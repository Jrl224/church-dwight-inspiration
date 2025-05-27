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

// Pre-defined innovations with visual styles
const innovations = [
  { 
    tech: 'AI-Personalized Formula', 
    desc: 'adapts to your unique chemistry in real-time',
    color: 'from-purple-400 to-blue-500',
    hex1: '9333EA',
    hex2: '3B82F6'
  },
  { 
    tech: 'Biodegradable Nanocapsules', 
    desc: 'dissolves into nutrients for soil',
    color: 'from-green-400 to-emerald-500',
    hex1: '4ADE80',
    hex2: '10B981'
  },
  { 
    tech: 'Microbiome Intelligence', 
    desc: 'balances 500+ beneficial bacteria strains',
    color: 'from-teal-400 to-cyan-500',
    hex1: '2DD4BF',
    hex2: '06B6D4'
  },
  { 
    tech: 'Carbon-Negative Technology', 
    desc: 'removes 10x more CO2 than it produces',
    color: 'from-sky-400 to-blue-500',
    hex1: '38BDF8',
    hex2: '3B82F6'
  },
  { 
    tech: 'Quantum-Enhanced Molecules', 
    desc: 'uses quantum tunneling for deeper penetration',
    color: 'from-indigo-400 to-purple-500',
    hex1: '818CF8',
    hex2: 'A855F7'
  },
  { 
    tech: 'Self-Regenerating Formula', 
    desc: 'rebuilds itself for 90-day effectiveness',
    color: 'from-pink-400 to-rose-500',
    hex1: 'F472B6',
    hex2: 'F43F5E'
  },
  { 
    tech: 'Photosynthetic Ingredients', 
    desc: 'powered by sunlight exposure',
    color: 'from-yellow-400 to-orange-500',
    hex1: 'FACC15',
    hex2: 'F97316'
  },
  { 
    tech: 'Zero-Gravity Manufacturing', 
    desc: 'made in space for ultimate purity',
    color: 'from-gray-400 to-slate-500',
    hex1: '9CA3AF',
    hex2: '64748B'
  },
  { 
    tech: 'Biomimetic Enzyme Complex', 
    desc: 'copies nature\'s most powerful cleaners',
    color: 'from-lime-400 to-green-500',
    hex1: 'A3E635',
    hex2: '22C55E'
  },
  { 
    tech: 'Graphene-Enhanced Particles', 
    desc: '200x stronger than traditional formulas',
    color: 'from-red-400 to-orange-500',
    hex1: 'F87171',
    hex2: 'F97316'
  },
];

function generateConcept(category: string, brand: string) {
  // Defensive coding - ensure category is valid
  if (!category || typeof category !== 'string') {
    category = 'general';
  }
  
  const innovation = innovations[Math.floor(Math.random() * innovations.length)];
  const categoryClean = category.replace(/-/g, ' ');
  
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
  const year = 2025 + Math.floor(Math.random() * 5);
  const productName = `${brand} ${baseName} ${year}`;
  
  // Use placeholder.com with custom gradient colors for instant response
  const placeholderUrl = `https://via.placeholder.com/1024x1024/${innovation.hex1}/${innovation.hex2}?text=${encodeURIComponent(productName.replace(/ /g, '+'))}`;
  
  return {
    productName,
    innovation: innovation.tech,
    marketDisruption: `World's first ${categoryClean} product that ${innovation.desc}`,
    consumerInsight: `73% of consumers want ${categoryClean} products that combine cutting-edge science with sustainability`,
    imageUrl: placeholderUrl,
    gradient: innovation.color,
    features: [
      `Revolutionary ${innovation.tech} system`,
      `Clinically proven in ${Math.floor(Math.random() * 20 + 10)} countries`,
      `${Math.floor(Math.random() * 50 + 50)}% more effective than leading brands`
    ],
    ingredients: `Patented ${innovation.tech} complex with ${Math.floor(Math.random() * 20 + 5)} active compounds`,
    usage: `Apply once daily for transformative results in ${Math.floor(Math.random() * 7 + 7)} days`,
    price: `$${Math.floor(Math.random() * 30 + 20)}.99 - ${Math.floor(Math.random() * 20 + 10)}oz`,
    sustainability: `${Math.floor(Math.random() * 50 + 50)}% recycled ocean plastic packaging, ${Math.floor(Math.random() * 30 + 70)}% renewable energy`,
    dallePrompt: `Professional product photography: ${brand} ${categoryClean} product bottle with ${innovation.tech}, modern minimalist packaging, white background, studio lighting, photorealistic, commercial photography`
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

  try {
    const { category, brand: requestedBrand } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    console.log('Generating for:', { category, requestedBrand });

    // Select brand
    const brand = requestedBrand || brandsByCategory[category]?.[Math.floor(Math.random() * brandsByCategory[category].length)] || 'ARM & HAMMER';
    
    // Generate concept instantly
    const concept = generateConcept(category, brand);
    
    // Try to use DALL-E if available, but with strict timeout
    let imageUrl = concept.imageUrl;
    
    if (openai && process.env.USE_DALLE === 'true') {
      try {
        // Set a 5-second timeout for DALL-E
        const imagePromise = openai.images.generate({
          model: "dall-e-3",
          prompt: concept.dallePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "natural",
        });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DALL-E timeout')), 5000)
        );
        
        const imageResponse = await Promise.race([imagePromise, timeoutPromise]) as any;
        
        if (imageResponse.data && imageResponse.data[0]) {
          imageUrl = imageResponse.data[0].url;
        }
      } catch (error) {
        console.log('DALL-E failed or timed out, using placeholder');
        // Keep using placeholder URL
      }
    }
    
    const image = {
      id: uuidv4(),
      url: imageUrl,
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
      gradient: concept.gradient,
      createdAt: new Date().toISOString(),
    };

    return res.status(200).json({
      images: [image],
      sessionId: uuidv4(),
      totalGenerated: 1,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate',
      details: error.message
    });
  }
}