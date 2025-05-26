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

  const systemPrompt = `You are a world-class product innovation strategist for Church & Dwight. Your role is to create breakthrough product concepts that would genuinely excite consumers and disrupt the market. You research competitors, analyze trends, and create products that don't exist yet but should.`;

  const userPrompt = `Create an innovative ${category} product concept for ${brand}. 

IMPORTANT: 
1. Research what competitors like P&G, Unilever, Colgate, etc. are doing in this space
2. Identify a genuine unmet consumer need or pain point
3. Create a product that doesn't exist yet but would be groundbreaking
4. Think about sustainability, technology integration, personalization, or new usage occasions
5. Be specific about the innovation - not generic

Generate a detailed response with:
1. A hyper-specific product name and description
2. The key innovation/technology that makes it unique
3. Why this would disrupt the market
4. Target consumer insight
5. A detailed DALL-E 3 prompt for generating a photorealistic product image
6. Product details for an infographic including:
   - 3 key features with specific benefits
   - Ingredients/technology highlights
   - Usage instructions
   - Price point and size
   - Sustainability features

Format as JSON with fields: productName, innovation, marketDisruption, consumerInsight, dallePrompt, features, ingredients, usage, price, sustainability`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.9, // Higher for more creativity
    max_tokens: 1500,
    response_format: { type: "json_object" }
  });

  const response = completion.choices[0].message.content;
  if (!response) throw new Error('No response from GPT-4');

  return JSON.parse(response);
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
    const { category, brand: requestedBrand, count = 2 } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    console.log('Generating innovative concepts for:', { category, requestedBrand, count });

    const images = [];
    
    // Generate multiple unique concepts
    const imagesToGenerate = Math.min(count, 3);
    
    for (let i = 0; i < imagesToGenerate; i++) {
      try {
        // Select a brand if not specified
        const brand = requestedBrand || brandsByCategory[category]?.[Math.floor(Math.random() * brandsByCategory[category].length)] || 'ARM & HAMMER';
        
        // Generate innovative concept using GPT-4
        console.log(`Generating concept ${i + 1}/${imagesToGenerate} for ${brand}...`);
        const concept = await generateInnovativeProductConcept(category, brand);
        
        // Generate image using DALL-E 3
        console.log(`Creating image for: ${concept.productName}`);
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: concept.dallePrompt,
          n: 1,
          size: "1024x1024",
          quality: "hd",
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
      } catch (conceptError: any) {
        console.error(`Error generating concept ${i + 1}:`, conceptError);
        // Continue with other concepts if one fails
      }
    }

    if (images.length === 0) {
      throw new Error('No concepts were generated successfully');
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
        error: 'Failed to generate concepts',
        details: error.message || 'Unknown error occurred'
      });
    }
  }
}