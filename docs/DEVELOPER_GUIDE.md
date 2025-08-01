# Developer Guide - Reference Validator

## 🚀 Quick Start

The Reference Validator is built with a **provider-agnostic architecture**, meaning you can choose your own authentication, database, email, and other services.

### 1. Clone and Install

```bash
git clone https://github.com/ah2484/referencechecker.git
cd referencechecker
npm install
```

### 2. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the working foundation with mock providers.

## 🏗️ Architecture Overview

### Provider System

The application uses a **provider registry system** that allows you to:

- **Register** your own implementations of any service
- **Switch** between different providers via environment variables
- **Extend** the system with new providers without changing core code

### Core Components

```
src/
├── providers/
│   ├── types.ts              # Provider interfaces
│   ├── init.ts               # Provider initialization
│   ├── mock/                 # Mock implementations
│   └── [your-provider]/      # Your custom providers
├── lib/
│   └── provider-registry.ts  # Provider registry system
├── app/                      # Next.js App Router
└── components/               # React components
```

## 🔧 Implementing Custom Providers

### Step 1: Create Your Provider

Create a new file in `src/providers/[your-provider-name]/`:

```typescript
// src/providers/supabase/supabase-database-provider.ts
import { DatabaseProvider, Candidate } from '../types';

export class SupabaseDatabaseProvider implements DatabaseProvider {
  private supabase: any;

  constructor() {
    // Initialize your Supabase client
    this.supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
  }

  async createCandidate(candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> {
    const { data, error } = await this.supabase
      .from('candidates')
      .insert(candidate)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Implement all other methods from DatabaseProvider interface
  // ...
}
```

### Step 2: Register Your Provider

Update `src/providers/init.ts`:

```typescript
import { SupabaseDatabaseProvider } from './supabase/supabase-database-provider';

export function initializeProviders() {
  // Register your custom provider
  ProviderRegistry.registerDatabaseProvider('supabase', new SupabaseDatabaseProvider());
  
  // Keep existing mock providers as fallbacks
  ProviderRegistry.registerDatabaseProvider('mock', new MockDatabaseProvider());
}
```

### Step 3: Configure Environment

Set your environment variables:

```env
# Choose your provider
DATABASE_PROVIDER=supabase

# Your provider's configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## 📋 Available Provider Interfaces

### 1. Authentication Provider

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

**Example Implementations:**
- Clerk (`@clerk/nextjs`)
- Auth0 (`@auth0/nextjs-auth0`)
- NextAuth.js (`next-auth`)
- Custom JWT implementation

### 2. Database Provider

```typescript
interface DatabaseProvider {
  // Candidate operations
  createCandidate(candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate>;
  getCandidate(id: string): Promise<Candidate | null>;
  // ... more methods
}
```

**Example Implementations:**
- Supabase (`@supabase/supabase-js`)
- PostgreSQL (`pg`)
- MongoDB (`mongodb`)
- Firebase (`firebase/firestore`)

### 3. Email Provider

```typescript
interface EmailProvider {
  sendEmail(to: string, subject: string, content: string): Promise<void>;
  sendTemplate(template: string, data: EmailData): Promise<void>;
  verifyEmail(email: string): Promise<boolean>;
  getDeliveryStatus(messageId: string): Promise<EmailDeliveryStatus>;
}
```

**Example Implementations:**
- Resend (`resend`)
- SendGrid (`@sendgrid/mail`)
- AWS SES (`@aws-sdk/client-ses`)
- Nodemailer (`nodemailer`)

### 4. AI/NLP Provider

```typescript
interface NLPProvider {
  analyzeSentiment(text: string): Promise<number>;
  summarizeReferences(responses: ReferenceResponse[]): Promise<string>;
  generateScores(responses: ReferenceResponse[]): Promise<ScoreBreakdown>;
  extractEntities(text: string): Promise<Record<string, string[]>>;
  detectRedFlags(text: string): Promise<string[]>;
}
```

**Example Implementations:**
- OpenAI (`openai`)
- Anthropic (`@anthropic-ai/sdk`)
- Hugging Face (`@huggingface/inference`)
- Local models (TensorFlow.js, ONNX)

## 🎯 Common Implementation Patterns

### 1. Environment-Based Configuration

```typescript
export class ConfigurableProvider implements DatabaseProvider {
  private config: any;

  constructor() {
    this.config = {
      url: process.env.DATABASE_URL,
      apiKey: process.env.DATABASE_API_KEY,
      // ... other config
    };
  }
}
```

### 2. Error Handling

```typescript
async createCandidate(candidate: any): Promise<Candidate> {
  try {
    const result = await this.client.insert(candidate);
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Failed to create candidate: ${error.message}`);
  }
}
```

### 3. Type Safety

```typescript
// Always implement the exact interface
class MyProvider implements DatabaseProvider {
  // TypeScript will ensure you implement all required methods
  // with the correct signatures
}
```

## 🔄 Switching Providers

### Via Environment Variables

```env
# Switch to Supabase
DATABASE_PROVIDER=supabase
AUTH_PROVIDER=clerk
EMAIL_PROVIDER=resend

# Switch to Firebase
DATABASE_PROVIDER=firebase
AUTH_PROVIDER=firebase-auth
EMAIL_PROVIDER=sendgrid
```

### Via Code

```typescript
import { ProviderRegistry } from '../lib/provider-registry';

// Register multiple providers
ProviderRegistry.registerDatabaseProvider('supabase', new SupabaseProvider());
ProviderRegistry.registerDatabaseProvider('firebase', new FirebaseProvider());

// Use specific provider
const database = ProviderRegistry.getDatabaseProvider('supabase');
```

## 🧪 Testing Your Providers

### 1. Unit Tests

```typescript
// tests/providers/supabase-database-provider.test.ts
import { SupabaseDatabaseProvider } from '../../src/providers/supabase/supabase-database-provider';

describe('SupabaseDatabaseProvider', () => {
  let provider: SupabaseDatabaseProvider;

  beforeEach(() => {
    provider = new SupabaseDatabaseProvider();
  });

  test('should create candidate', async () => {
    const candidate = await provider.createCandidate({
      email: 'test@example.com',
      fullName: 'Test User',
      currentEmploymentStatus: 'employed'
    });

    expect(candidate.id).toBeDefined();
    expect(candidate.email).toBe('test@example.com');
  });
});
```

### 2. Integration Tests

```typescript
// tests/integration/provider-integration.test.ts
import { getProviders } from '../../src/providers/init';

describe('Provider Integration', () => {
  test('should work with all providers', async () => {
    const { auth, database, email } = getProviders();
    
    // Test the full flow
    const user = await auth.authenticate({ email: 'test@example.com' });
    const candidate = await database.createCandidate({ /* ... */ });
    await email.sendEmail('test@example.com', 'Welcome', 'Welcome!');
    
    expect(user).toBeDefined();
    expect(candidate).toBeDefined();
  });
});
```

## 📦 Deployment

### 1. Environment Configuration

Create `.env.production`:

```env
# Production providers
DATABASE_PROVIDER=supabase
AUTH_PROVIDER=clerk
EMAIL_PROVIDER=resend
NLP_PROVIDER=openai

# Production credentials
SUPABASE_URL=your_production_supabase_url
SUPABASE_KEY=your_production_supabase_key
CLERK_SECRET_KEY=your_production_clerk_key
RESEND_API_KEY=your_production_resend_key
OPENAI_API_KEY=your_production_openai_key
```

### 2. Build and Deploy

```bash
npm run build
npm start
```

## 🚀 Advanced Features

### 1. Custom Provider with Caching

```typescript
export class CachedDatabaseProvider implements DatabaseProvider {
  private cache = new Map<string, any>();
  private ttl = 5 * 60 * 1000; // 5 minutes

  async getCandidate(id: string): Promise<Candidate | null> {
    const cacheKey = `candidate:${id}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }

    const candidate = await this.underlyingProvider.getCandidate(id);
    
    if (candidate) {
      this.cache.set(cacheKey, {
        data: candidate,
        timestamp: Date.now()
      });
    }

    return candidate;
  }
}
```

### 2. Provider with Retry Logic

```typescript
export class RetryableEmailProvider implements EmailProvider {
  private maxRetries = 3;
  private delay = 1000; // 1 second

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await this.underlyingProvider.sendEmail(to, subject, content);
        return;
      } catch (error) {
        if (attempt === this.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, this.delay * attempt));
      }
    }
  }
}
```

### 3. Composite Provider

```typescript
export class CompositeDatabaseProvider implements DatabaseProvider {
  constructor(
    private primary: DatabaseProvider,
    private fallback: DatabaseProvider
  ) {}

  async createCandidate(candidate: any): Promise<Candidate> {
    try {
      return await this.primary.createCandidate(candidate);
    } catch (error) {
      console.warn('Primary database failed, using fallback:', error);
      return await this.fallback.createCandidate(candidate);
    }
  }
}
```

## 📚 Resources

### Documentation
- [Provider Interfaces](./PROVIDER_INTERFACES.md)
- [API Reference](./API_REFERENCE.md)
- [Deployment Guide](./DEPLOYMENT.md)

### Examples
- [Supabase Implementation](./examples/supabase/)
- [Firebase Implementation](./examples/firebase/)
- [Custom JWT Auth](./examples/custom-auth/)

### Community
- [GitHub Issues](https://github.com/ah2484/referencechecker/issues)
- [Discussions](https://github.com/ah2484/referencechecker/discussions)
- [Contributing Guide](./CONTRIBUTING.md)

## 🎉 You're Ready!

You now have a **fully functional, provider-agnostic foundation** that you can:

1. **Run immediately** with mock providers
2. **Extend** with your own providers
3. **Deploy** to any platform
4. **Contribute** to the open source community

The system is designed to be **developer-friendly** and **production-ready** from day one! 