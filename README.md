# Synergize SaaS Application

A modern SaaS application built with Next.js, featuring AI-powered Git repository analysis, dashboard management, and API key management.

## Features

- 🤖 **AI-Powered Git Analysis** - Analyze Git repositories using OpenAI
- 📊 **Dashboard Management** - Comprehensive dashboard for managing API keys and settings
- 🔑 **API Key Management** - Secure storage and management of API keys
- 🎨 **Modern UI** - Built with Tailwind CSS and Next.js 15
- 🚀 **Full-Stack** - Complete frontend and backend implementation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- OpenAI API key
- Supabase account and project

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd synergize
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your actual values
   OPENAI_API_KEY=your_actual_openai_api_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
synergize/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── dashboards/        # Dashboard pages and components
│   └── playground/        # Development/testing pages
├── lib/                   # Utility libraries
├── public/                # Static assets
└── docs/                  # Documentation
```

## API Endpoints

- `POST /api/git-summary` - Generate Git repository summaries
- `GET /api/protected` - Protected API endpoint
- `POST /api/test-connection` - Test database connection
- `POST /api/test-delete` - Test delete operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.
