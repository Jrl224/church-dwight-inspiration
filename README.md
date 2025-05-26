# Church & Dwight Innovation Inspiration

AI-powered product concept generator for Church & Dwight brands using OpenAI's DALL-E 3.

## 🚀 Live Demo

Visit: [churchdwight.imagine.tools](https://churchdwight.imagine.tools) (once deployed)

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
- **Backend**: Vercel Functions (Serverless)
- **AI Integration**: OpenAI DALL-E 3 API
- **State Management**: Zustand
- **Hosting**: Vercel

## 🚀 Quick Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJrl224%2Fchurch-dwight-inspiration&env=OPENAI_API_KEY&envDescription=Your%20OpenAI%20API%20key%20with%20DALL-E%203%20access&project-name=church-dwight-innovation&repository-name=church-dwight-innovation)

### Manual Deployment Steps

1. **Fork or Clone the Repository**
   ```bash
   git clone https://github.com/Jrl224/church-dwight-inspiration.git
   cd church-dwight-inspiration
   ```

2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: church-dwight-innovation
   - Directory: ./ (current directory)
   - Override settings: No

4. **Add Environment Variables**
   
   After deployment, go to your [Vercel Dashboard](https://vercel.com/dashboard):
   - Select your project
   - Go to Settings → Environment Variables
   - Add the following:
     - `OPENAI_API_KEY`: Your OpenAI API key with DALL-E 3 access

5. **Redeploy**
   ```bash
   vercel --prod
   ```

## 🌐 Custom Domain Setup (churchdwight.imagine.tools)

### Option 1: If you control imagine.tools DNS

1. Go to your Vercel project dashboard
2. Navigate to Settings → Domains
3. Add domain: `churchdwight.imagine.tools`
4. In your DNS provider for imagine.tools, add:
   - Type: CNAME
   - Name: `churchdwight`
   - Value: `cname.vercel-dns.com`
   - TTL: 3600 (or your preference)

### Option 2: Using Vercel's Nameservers

1. Add the domain in Vercel as above
2. Follow Vercel's instructions to point your subdomain to their nameservers

### Verify Domain

After DNS propagation (usually 5-30 minutes):
- Visit https://churchdwight.imagine.tools
- The site should load with HTTPS automatically configured

## 🔧 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jrl224/church-dwight-inspiration.git
   cd church-dwight-inspiration
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   ```

3. **Create .env file in root**
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run development server**
   ```bash
   vercel dev
   ```

   This will start both the frontend and API functions locally.

## 📊 Environment Variables

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API key with DALL-E 3 access | [OpenAI Platform](https://platform.openai.com/api-keys) |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | API endpoint URL | Auto-configured by Vercel |

## 🏗️ Project Structure

```
church-dwight-inspiration/
├── api/                    # Vercel Functions (Backend)
│   ├── generate.ts        # DALL-E 3 generation endpoint
│   └── health.ts          # Health check endpoint
├── frontend/              # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── services/      # API services
│   │   └── store.ts       # Zustand state management
│   └── public/
├── vercel.json            # Vercel configuration
└── package.json           # Root package configuration
```

## 🎨 Customization

### Adding New Brands

Edit `api/generate.ts` and `frontend/src/services/openai.service.ts`:

```typescript
const brandsByCategory: Record<string, string[]> = {
  'category-name': ['BRAND1', 'BRAND2'],
  // Add your brands here
};
```

### Adding New Categories

1. Update the categories array in `frontend/src/components/CategorySelector.tsx`
2. Add prompts in `api/generate.ts`
3. Add features in `frontend/src/services/openai.service.ts`

## 🔍 API Endpoints

- `POST /api/generate` - Generate product concepts
  ```json
  {
    "category": "laundry",
    "brand": "ARM & HAMMER",
    "count": 3
  }
  ```

- `GET /api/health` - Health check endpoint

## 📈 Cost Considerations

- Each DALL-E 3 image generation costs approximately $0.04-0.08
- The app limits generation to 3 images per request
- Consider implementing rate limiting for production use

## 🐛 Troubleshooting

### "Failed to generate products"
- Check your OpenAI API key is valid
- Ensure your OpenAI account has DALL-E 3 access
- Check API key has sufficient credits

### Domain not working
- Wait for DNS propagation (up to 48 hours)
- Verify CNAME record is correctly set
- Check domain in Vercel dashboard shows "Valid Configuration"

### Build failures
- Ensure all dependencies are installed
- Check Node.js version (16+ required)
- Review build logs in Vercel dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Proprietary - Church & Dwight Co., Inc.

## 🆘 Support

For issues or questions:
- Open an issue in the [GitHub repository](https://github.com/Jrl224/church-dwight-inspiration/issues)
- Check existing issues for solutions

---

Built with ❤️ for Church & Dwight innovation teams