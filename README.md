# Reference Validator - Open Source Foundation

A **provider-agnostic, open-source foundation** for reference and employment validation tools. Built with modern web technologies and designed for maximum flexibility and developer freedom.

## 🎯 What This Is

This is a **working foundation** that provides:

- ✅ **Provider-agnostic architecture** - Choose your own auth, database, email, etc.
- ✅ **Mock providers** for immediate development
- ✅ **TypeScript interfaces** for all services
- ✅ **Working application** with sample data
- ✅ **Ready for contribution** - Open source from day one

## 🚀 Quick Start

### 1. Clone and Run

```bash
git clone https://github.com/ah2484/referencechecker.git
cd referencechecker
npm install
npm run dev
```

Visit `http://localhost:3000` to see the working foundation!

### 2. Choose Your Providers

The system works with **any** technology stack. Set environment variables to choose your providers:

```env
# Use Supabase
DATABASE_PROVIDER=supabase
AUTH_PROVIDER=clerk
EMAIL_PROVIDER=resend

# Use Firebase
DATABASE_PROVIDER=firebase
AUTH_PROVIDER=firebase-auth
EMAIL_PROVIDER=sendgrid

# Use your own custom providers
DATABASE_PROVIDER=custom
AUTH_PROVIDER=custom
EMAIL_PROVIDER=custom
```

## 🏗️ Architecture

### Provider System

```
┌─────────────────────────────────────────────────────────────┐
│                    Provider Registry                        │
├─────────────────────────────────────────────────────────────┤
│  Auth Providers    │  Database Providers  │  Email Providers │
│  • Clerk          │  • Supabase          │  • Resend        │
│  • Auth0          │  • Firebase          │  • SendGrid      │
│  • Custom JWT     │  • PostgreSQL        │  • AWS SES       │
│  • Mock           │  • MongoDB           │  • Custom        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Application                         │
│  • Next.js 14 (App Router)                                 │
│  • TypeScript                                              │
│  • Tailwind CSS                                            │
│  • Provider-agnostic logic                                 │
└─────────────────────────────────────────────────────────────┘
```

### What's Included

- **Mock Providers**: Working implementations for development
- **Provider Interfaces**: TypeScript contracts for all services
- **Registry System**: Easy provider registration and switching
- **Sample Data**: Realistic data to see the system in action
- **API Endpoints**: Working REST API with provider abstraction

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14** (App Router)
- **TypeScript** (Full type safety)
- **Tailwind CSS** (Styling)
- **Provider Registry** (Custom architecture)

### Development Tools
- **ESLint** + **Prettier** (Code quality)
- **Jest** + **Testing Library** (Testing)
- **GitHub Actions** (CI/CD)

### Provider Examples
- **Mock Providers** (Development)
- **Supabase** (Database)
- **Clerk** (Authentication)
- **Resend** (Email)
- **OpenAI** (AI/NLP)

## 🔧 Implementing Your Own Providers

### 1. Create Your Provider

```typescript
// src/providers/my-database/my-database-provider.ts
import { DatabaseProvider, Candidate } from '../types';

export class MyDatabaseProvider implements DatabaseProvider {
  async createCandidate(candidate: any): Promise<Candidate> {
    // Your implementation here
    return newCandidate;
  }
  
  // Implement all other methods...
}
```

### 2. Register Your Provider

```typescript
// src/providers/init.ts
import { MyDatabaseProvider } from './my-database/my-database-provider';

export function initializeProviders() {
  ProviderRegistry.registerDatabaseProvider('my-database', new MyDatabaseProvider());
}
```

### 3. Use Your Provider

```env
DATABASE_PROVIDER=my-database
```

## 📋 Available Provider Interfaces

### Authentication Provider
```typescript
interface AuthProvider {
  authenticate(credentials: any): Promise<User>;
  verifyToken(token: string): Promise<User | null>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): Promise<boolean>;
  getAuthUrl(provider: string): string;
}
```

### Database Provider
```typescript
interface DatabaseProvider {
  createCandidate(candidate: any): Promise<Candidate>;
  getCandidate(id: string): Promise<Candidate | null>;
  // ... 20+ methods for full CRUD operations
}
```

### Email Provider
```typescript
interface EmailProvider {
  sendEmail(to: string, subject: string, content: string): Promise<void>;
  sendTemplate(template: string, data: EmailData): Promise<void>;
  verifyEmail(email: string): Promise<boolean>;
  getDeliveryStatus(messageId: string): Promise<EmailDeliveryStatus>;
}
```

### AI/NLP Provider
```typescript
interface NLPProvider {
  analyzeSentiment(text: string): Promise<number>;
  summarizeReferences(responses: ReferenceResponse[]): Promise<string>;
  generateScores(responses: ReferenceResponse[]): Promise<ScoreBreakdown>;
  extractEntities(text: string): Promise<Record<string, string[]>>;
  detectRedFlags(text: string): Promise<string[]>;
}
```

## 🎯 What You Can Do Right Now

### 1. Run the Application
```bash
npm run dev
# Visit http://localhost:3000
```

### 2. Explore the Provider System
- View available providers at `/api/providers`
- See provider status in the UI
- Check the working mock data

### 3. Implement Your Own Providers
- Copy the example in `src/providers/examples/`
- Follow the patterns in `src/providers/mock/`
- Register your providers in `src/providers/init.ts`

### 4. Extend the Application
- Add new components in `src/components/`
- Create new API routes in `src/app/api/`
- Build new features using the provider system

## 📚 Documentation

- [Developer Guide](./docs/DEVELOPER_GUIDE.md) - Complete guide to the provider system
- [Product Requirements](./prd.md) - Full product specification
- [Implementation Plan](./IMPLEMENTATION_PLAN.md) - Development roadmap
- [Contributing Guide](./docs/CONTRIBUTING.md) - How to contribute
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deployment options

## 🤝 Contributing

This is an **open source foundation** designed for community contribution:

1. **Fork** the repository
2. **Create** your feature branch
3. **Implement** your providers or features
4. **Test** your changes
5. **Submit** a pull request

### Good First Issues
- Implement a new provider (Supabase, Firebase, etc.)
- Add new UI components
- Create additional API endpoints
- Improve documentation
- Add tests

## 🚀 Deployment

### Quick Deploy
```bash
npm run build
npm start
```

### Environment Configuration
```env
# Choose your providers
DATABASE_PROVIDER=supabase
AUTH_PROVIDER=clerk
EMAIL_PROVIDER=resend

# Your provider credentials
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
CLERK_SECRET_KEY=your_clerk_key
RESEND_API_KEY=your_resend_key
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🎉 You're Ready!

You now have a **fully functional, provider-agnostic foundation** that you can:

1. **Run immediately** with mock providers
2. **Extend** with your own providers
3. **Deploy** to any platform
4. **Contribute** to the open source community

The system is designed to be **developer-friendly** and **production-ready** from day one!

---

**Built with ❤️ for the open source community** 