# Reference Validator

An open-source reference and employment validation tool for hiring teams. Built with Next.js, Supabase, and modern web technologies.

## 🚀 Features

- **Candidate Authentication**: LinkedIn OAuth integration for secure candidate verification
- **Employment History Validation**: Comprehensive employment timeline verification
- **Reference Management**: Automated referee outreach and response collection
- **AI-Powered Scoring**: Intelligent analysis of reference responses
- **Dual Employment Detection**: LinkedIn integration to detect overlapping employment
- **Admin Dashboard**: Complete overview and management interface
- **Developer Friendly**: Modular architecture with pluggable providers

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (Supabase)    │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐            ┌────▼────┐            ┌────▼────┐
    │ Clerk   │            │PostgreSQL│            │ OpenAI  │
    │(Auth)   │            │Database │            │(AI/NLP) │
    └─────────┘            └─────────┘            └─────────┘
         │                       │                       │
    ┌────▼────┐            ┌────▼────┐            ┌────▼────┐
    │ Resend  │            │Storage  │            │LinkedIn │
    │(Email)  │            │(Files)  │            │(Parsing)│
    └─────────┘            └─────────┘            └─────────┘
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Clerk with LinkedIn OAuth
- **Email**: Resend
- **AI/NLP**: OpenAI API
- **UI Components**: shadcn/ui, Radix UI
- **Forms**: React Hook Form, Zod validation
- **Charts**: Recharts
- **Deployment**: Vercel, Docker

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Clerk account
- Resend account
- OpenAI API key

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/reference-validator.git
cd reference-validator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp env.example .env.local
```

Edit `.env.local` with your service credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Email
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com

# AI
OPENAI_API_KEY=your_openai_api_key
```

### 4. Set up the database

```bash
npm run db:setup
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 🔧 Configuration

### Authentication Providers

The system supports multiple authentication providers through a pluggable architecture:

```typescript
// src/providers/auth/clerk.ts
export class ClerkAuthProvider implements AuthProvider {
  async authenticate(credentials: any): Promise<User> {
    // Clerk implementation
  }
}

// src/providers/auth/custom.ts
export class CustomAuthProvider implements AuthProvider {
  async authenticate(credentials: any): Promise<User> {
    // Your custom implementation
  }
}
```

### Email Providers

Configure different email services:

```typescript
// src/providers/email/resend.ts
export class ResendEmailProvider implements EmailProvider {
  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    // Resend implementation
  }
}
```

### AI/NLP Providers

Switch between different AI services:

```typescript
// src/providers/nlp/openai.ts
export class OpenAINLPProvider implements NLPProvider {
  async analyzeSentiment(text: string): Promise<number> {
    // OpenAI implementation
  }
}
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 app router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Admin dashboard routes
│   ├── api/               # API routes
│   ├── submit/            # Candidate submission
│   └── reference/         # Reference forms
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utility functions
│   ├── supabase.ts       # Database client
│   ├── auth.ts           # Authentication utilities
│   ├── email.ts          # Email service
│   └── ai-scoring.ts     # AI scoring logic
├── providers/            # Pluggable service providers
│   ├── auth/             # Authentication providers
│   ├── email/            # Email providers
│   └── nlp/              # AI/NLP providers
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker

```bash
# Build the image
docker build -t reference-validator .

# Run the container
docker run -p 3000:3000 reference-validator
```

### Self-hosted

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](./docs/)
- 🐛 [Report a Bug](https://github.com/your-org/reference-validator/issues)
- 💡 [Request a Feature](https://github.com/your-org/reference-validator/issues)
- 💬 [Discussions](https://github.com/your-org/reference-validator/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend-as-a-service
- [Clerk](https://clerk.com/) for authentication
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

Made with ❤️ by the Reference Validator team 