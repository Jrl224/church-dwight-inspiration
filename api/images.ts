import { VercelRequest, VercelResponse } from '@vercel/node';

// Tool images mapping - in production these would be served from CDN
const imageMap: Record<string, string> = {
  'innovation-inspiration-tool': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop&q=80&blend=0a0a0aCC&blend-mode=multiply&sat=-100&con=20',
  'formula-generator-tool': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop&q=80&blend=0a0a0aCC&blend-mode=multiply&sat=-100&con=20',
  'patent-analyzer-tool': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&q=80&blend=0a0a0aCC&blend-mode=multiply&sat=-100&con=20',
  'stability-predictor-tool': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop&q=80&blend=0a0a0aCC&blend-mode=multiply&sat=-100&con=20',
  'package-sustainability-tool': 'https://images.unsplash.com/photo-1536147210925-5cb7a7a4f9fe?w=600&h=400&fit=crop&q=80&blend=0a0a0aCC&blend-mode=multiply&sat=-100&con=20',
  'consumer-insights-tool': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80&blend=0a0a0aCC&blend-mode=multiply&sat=-100&con=20'
};

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { name } = req.query;
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Image name is required' });
  }

  const cleanName = name.replace('.png', '').replace('.jpg', '');
  const imageUrl = imageMap[cleanName];
  
  if (!imageUrl) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Redirect to the image URL
  res.redirect(302, imageUrl);
}