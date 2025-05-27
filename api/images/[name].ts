import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

// In production, these would be hosted on CDN
// For demo, using placeholder images
const imageMap: Record<string, string> = {
  'innovation-inspiration-tool.png': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=400&fit=crop&q=80',
  'formula-generator-tool.png': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=400&fit=crop&q=80',
  'patent-analyzer-tool.png': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
  'stability-predictor-tool.png': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop&q=80',
  'package-sustainability-tool.png': 'https://images.unsplash.com/photo-1536147210925-5cb7a7a4f9fe?w=400&h=400&fit=crop&q=80',
  'consumer-insights-tool.png': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&q=80'
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { name } = req.query;
  
  if (typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid image name' });
  }

  const imageUrl = imageMap[name];
  
  if (!imageUrl) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Redirect to the actual image
  res.redirect(imageUrl);
}