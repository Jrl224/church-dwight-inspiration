# Church & Dwight Innovation Inspiration

AI-powered product concept generator for Church & Dwight brands using OpenAI's DALL-E 3.

## Overview

This tool helps product managers and designers explore innovative product possibilities across Church & Dwight's brand portfolio without requiring creative input - pure AI-driven inspiration.

## Features

- **Brand Portfolio Coverage**: All major Church & Dwight brands including ARM & HAMMER, OXICLEAN, BATISTE, VITAFUSION, WATERPIK, THERABREATH, HERO, and more
- **Category-Based Generation**: Laundry, Oral Care, Personal Care, Health, Home Care, Pet Care, Sexual Wellness
- **AI-Powered Innovation**: Integrates trends like sustainability, plant-based formulas, smart features, and more
- **Visual Mind Mapping**: Explore product variations including scents, sizes, formulas, and packaging options
- **Export Capabilities**: PowerPoint deck generation, PDF mood boards, and concept sharing

## Tech Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js with Express.js
- **AI Integration**: OpenAI DALL-E 3 API
- **State Management**: Zustand
- **Hosting**: Vercel

## Deployment to Vercel

For deployment instructions and custom domain setup at churchdwight.imagine.tools, see the deployment guide below.

## Custom Domain Setup (churchdwight.imagine.tools)

1. Deploy to Vercel first
2. In Vercel project settings, go to "Domains"
3. Add domain: `churchdwight.imagine.tools`
4. Add CNAME record in your DNS provider:
   - Name: `churchdwight`
   - Value: `cname.vercel-dns.com`

## Environment Variables

### Frontend
- `REACT_APP_API_URL`: Backend API URL

### Backend
- `OPENAI_API_KEY`: Your OpenAI API key
- `DATABASE_URL`: Database connection string

## License

Proprietary - Church & Dwight Co., Inc.