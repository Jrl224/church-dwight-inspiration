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

async function generateInnovativeProductConcept(category: string, brand: string) {
  if (!openai) throw new Error('OpenAI not initialized');

  const systemPrompt = `You are a product innovation expert. Create a breakthrough product concept for ${brand} in the ${category} category. Be specific and innovative.`;

  const userPrompt = `Create an innovative ${category} product for ${brand}. Generate:
1. Product name
2. Key innovation (one sentence)
3. Market disruption potential (one sentence) 
4. Consumer insight (one sentence)
5. DALL-E prompt (detailed product photography description)
6. 3 key features (brief)
7. Main ingredient/technology
8. Usage (brief)
9. Price
10. Sustainability feature

Format as JSON. Be creative and specific.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106", // Using faster model to avoid timeout
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.9,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error('No response from GPT');

    return JSON.parse(response);
  } catch (error) {
    console.error('GPT Error:', error);
    // Fallback to creative prompt generation
    return generateFallbackConcept(category, brand);
  }
}

function generateFallbackConcept(category: string, brand: string) {
  const innovations = [
    'AI-powered personalization', 'biodegradable capsules', 'microbiome technology',
    'carbon-negative formula', 'smart sensors', 'waterless technology',
    'probiotic-enhanced', 'DNA-customized', 'zero-waste refills'
  ];
  
  const innovation = innovations[Math.floor(Math.random() * innovations.length)];
  
  return {
    productName: `${brand} Future ${category.replace('-', ' ')} with ${innovation}`,
    innovation: innovation,
    marketDisruption: `First ${category} product with ${innovation} technology`,
    consumerInsight: `Consumers want sustainable, personalized ${category} solutions`,
    dallePrompt: `Ultra high-definition product photography: Futuristic ${brand} ${category} product featuring ${innovation}. Hyper-realistic 8K quality, perfect studio lighting, premium packaging with holographic accents, white background, award-winning commercial photography.`,
    features: ['Eco-friendly formula', 'Clinically proven results', '90% less plastic packaging'],
    ingredients: `Advanced ${innovation} complex`,
    usage: 'Use daily for best results',
    price: '$24.99 - 32oz',
    sustainability: 'Carbon neutral production'
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

  // Check if OpenAI is initialized
  if (!openai) {
    console.error('OpenAI client not initialized');
    return res.status(500).json({ 
      error: 'OpenAI API not configured',
      details: 'Please ensure OPENAI_API_KEY is set in environment variables'
    });
  }

  try {
    const { category, brand: requestedBrand, count = 1 } = req.body; // Reduced to 1 for faster response

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    console.log('Generating innovative concepts for:', { category, requestedBrand, count });

    const images = [];
    
    // Generate only 1 image to avoid timeout
    const brand = requestedBrand || brandsByCategory[category]?.[Math.floor(Math.random() * brandsByCategory[category].length)] || 'ARM & HAMMER';
    
    // Generate innovative concept
    console.log(`Generating concept for ${brand}...`);
    const concept = await generateInnovativeProductConcept(category, brand);
    
    // Generate image using DALL-E 3
    console.log(`Creating image...`);
    try {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: concept.dallePrompt || `Photorealistic ${brand} ${category} product with innovative packaging, studio photography, white background`,
        n: 1,
        size: "1024x1024",
        quality: "standard", // Using standard for faster generation
        style: "vivid",
      });

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
    } catch (imageError: any) {
      console.error('DALL-E Error:', imageError);
      // Return concept without image if DALL-E fails
      images.push({
        id: uuidv4(),
        url: 'https://via.placeholder.com/1024x1024/E5E7EB/6B7280?text=Image+Generation+Failed',
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

    // Generate session ID if needed
    const sessionId = req.headers['x-session-id'] as string || uuidv4();

    return res.status(200).json({
      images,
      sessionId,
      totalGenerated: images.length,
    });
  } catch (error: any) {
    console.error('Error in generate handler:', error);
    
    return res.status(500).json({ 
      error: 'Failed to generate concepts',
      details: error.message || 'Unknown error occurred'
    });
  }
}