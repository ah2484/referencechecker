# Implementation Plan: Reference Validation Tool

## Overview
This document outlines the systematic implementation approach for the open-source reference validation tool, designed to be developer-friendly and truly open source.

## Phase 1: Foundation & Architecture (Week 1-2)

### 1.1 Project Setup & Structure
```
reference-validator/
├── src/
│   ├── app/                    # Next.js 14 app router
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Utility functions and configurations
│   ├── providers/              # Pluggable service providers
│   ├── types/                  # TypeScript type definitions
│   └── hooks/                  # Custom React hooks
├── docs/                       # Documentation
├── scripts/                    # Build and deployment scripts
├── tests/                      # Test files
├── .github/                    # GitHub Actions and templates
└── docker/                     # Docker configuration
```

### 1.2 Technology Stack Decisions

**Core Stack:**
- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Supabase (PostgreSQL) - self-hostable alternative to Firebase
- **Authentication:** Clerk (with LinkedIn OAuth) + pluggable provider system
- **Email:** Resend (developer-friendly, good deliverability)
- **AI/NLP:** OpenAI API with fallback to local models
- **File Storage:** Supabase Storage
- **Deployment:** Vercel (primary) + Docker for self-hosting

**Why These Choices:**
- **Supabase over Firebase:** Better for open source, PostgreSQL, self-hostable
- **Clerk:** Excellent developer experience, LinkedIn OAuth built-in
- **Resend:** Simple API, good deliverability, developer-friendly
- **shadcn/ui:** Modern, accessible, customizable components

### 1.3 Database Schema Design

```sql
-- Core tables
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  linkedin_id VARCHAR,
  full_name VARCHAR NOT NULL,
  current_employment_status VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE employment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  company_name VARCHAR NOT NULL,
  job_title VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  achievements TEXT[],
  documents_urls TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE referees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  employment_id UUID REFERENCES employment_history(id),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  company VARCHAR NOT NULL,
  role VARCHAR,
  relationship VARCHAR,
  email_domain VARCHAR,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reference_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referee_id UUID REFERENCES referees(id),
  token VARCHAR UNIQUE NOT NULL,
  relationship VARCHAR,
  role_confirmation VARCHAR,
  duration_confirmation VARCHAR,
  would_rehire BOOLEAN,
  returned_property BOOLEAN,
  left_on_good_terms BOOLEAN,
  achievements_aligned BOOLEAN,
  concerns TEXT,
  additional_comments TEXT,
  submitted_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  credibility_score DECIMAL(3,2),
  integrity_score DECIMAL(3,2),
  achievement_score DECIMAL(3,2),
  rehire_score DECIMAL(3,2),
  summary TEXT,
  analysis_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  role VARCHAR NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action VARCHAR NOT NULL,
  resource_type VARCHAR NOT NULL,
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.4 Pluggable Provider System

Create a modular system for easy customization:

```typescript
// src/providers/types.ts
export interface AuthProvider {
  authenticate(credentials: any): Promise<User>;
  verifyToken(token: string): Promise<User | null>;
}

export interface EmailProvider {
  sendEmail(to: string, subject: string, content: string): Promise<void>;
  sendTemplate(template: string, data: any): Promise<void>;
}

export interface NLPProvider {
  analyzeSentiment(text: string): Promise<number>;
  summarizeReferences(responses: ReferenceResponse[]): Promise<Summary>;
  generateScores(responses: ReferenceResponse[]): Promise<Scores>;
}

// src/providers/clerk.ts
export class ClerkAuthProvider implements AuthProvider {
  // Implementation
}

// src/providers/openai.ts
export class OpenAINLPProvider implements NLPProvider {
  // Implementation
}
```

## Phase 2: Core Features (Week 3-4)

### 2.1 Candidate Authentication & Submission Flow

**Authentication Flow:**
1. Candidate visits `/submit` page
2. Redirected to LinkedIn OAuth via Clerk
3. After authentication, redirected to submission form
4. Form data saved to database
5. Candidate receives confirmation email
6. No further access to portal

**Key Components:**
- `CandidateAuthGuard` - Protects submission routes
- `SubmissionForm` - Multi-step form with validation
- `DocumentUpload` - File upload with preview
- `RefereeInput` - Dynamic referee addition

### 2.2 Referee Management System

**Referee Validation Logic:**
```typescript
// src/lib/referee-validation.ts
export class RefereeValidator {
  static async validateEmail(email: string, company: string): Promise<ValidationResult> {
    const domain = email.split('@')[1];
    const isFreeDomain = FREE_DOMAINS.includes(domain);
    const isCompanyDomain = await this.checkCompanyDomain(domain, company);
    
    return {
      isValid: !isFreeDomain || isCompanyDomain,
      confidence: isCompanyDomain ? 1.0 : 0.3,
      flags: isFreeDomain ? ['free_email_domain'] : []
    };
  }
}
```

**Reference Form Generation:**
- Unique token-based URLs for each referee
- 7-day expiration with resend capability
- Structured questions with scoring weights
- Mobile-responsive design

### 2.3 Email System

**Email Templates:**
- Welcome email to candidate
- Reference request to referees
- Reminder emails (automated)
- Completion notification to HR

**Email Provider Configuration:**
```typescript
// src/lib/email.ts
export class EmailService {
  private provider: EmailProvider;
  
  constructor(provider: EmailProvider = new ResendProvider()) {
    this.provider = provider;
  }
  
  async sendReferenceRequest(referee: Referee): Promise<void> {
    const token = await this.generateToken(referee.id);
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/reference/${token}`;
    
    await this.provider.sendTemplate('reference-request', {
      refereeName: referee.name,
      candidateName: referee.candidate.full_name,
      referenceUrl: url,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  }
}
```

## Phase 3: AI & Analytics (Week 5)

### 3.1 AI Scoring System

**Scoring Algorithm:**
```typescript
// src/lib/ai-scoring.ts
export class AIScoringService {
  private nlpProvider: NLPProvider;
  
  constructor(provider: NLPProvider = new OpenAINLPProvider()) {
    this.nlpProvider = provider;
  }
  
  async generateScores(responses: ReferenceResponse[]): Promise<CandidateScores> {
    const summary = await this.nlpProvider.summarizeReferences(responses);
    const sentiment = await this.nlpProvider.analyzeSentiment(summary);
    
    return {
      credibility: this.calculateCredibilityScore(responses),
      integrity: this.calculateIntegrityScore(responses, sentiment),
      achievements: this.calculateAchievementScore(responses),
      rehire: this.calculateRehireScore(responses),
      summary,
      flags: this.identifyFlags(responses)
    };
  }
}
```

**Score Calculation Logic:**
- **Credibility:** Email domain verification, LinkedIn presence, response quality
- **Integrity:** Sentiment analysis, specific question responses
- **Achievements:** Alignment between candidate claims and referee confirmation
- **Rehire:** Direct rehire question + overall sentiment

### 3.2 Dual Employment Detection

**LinkedIn Integration:**
```typescript
// src/lib/linkedin-parser.ts
export class LinkedInParser {
  async parseEmploymentHistory(profileUrl: string): Promise<EmploymentHistory[]> {
    // Use LinkedIn API or web scraping (with rate limiting)
    // Compare with candidate submissions
    // Flag overlaps and inconsistencies
  }
}
```

## Phase 4: Admin Dashboard (Week 6)

### 4.1 Dashboard Features

**Candidate Overview:**
- Employment timeline visualization
- Reference status tracking
- Score breakdown charts
- Flag indicators

**Admin Actions:**
- Manual referee approval/rejection
- Reference resend functionality
- Export capabilities
- Audit log viewing

### 4.2 Access Control

**Role-Based Access:**
```typescript
// src/lib/auth.ts
export enum UserRole {
  CANDIDATE = 'candidate',
  REFEREE = 'referee',
  ADMIN = 'admin',
  HR_MANAGER = 'hr_manager'
}

export class AccessControl {
  static canViewDashboard(user: User): boolean {
    return [UserRole.ADMIN, UserRole.HR_MANAGER].includes(user.role);
  }
  
  static canManageReferees(user: User): boolean {
    return user.role === UserRole.ADMIN;
  }
}
```

## Phase 5: Open Source Preparation (Week 7)

### 5.1 Documentation Structure

```
docs/
├── README.md                   # Project overview
├── CONTRIBUTING.md            # Contribution guidelines
├── DEPLOYMENT.md              # Deployment instructions
├── API.md                     # API documentation
├── ARCHITECTURE.md            # System architecture
└── examples/
    ├── docker-compose.yml     # Local development
    ├── .env.example          # Environment variables
    └── seed-data.json        # Sample data
```

### 5.2 Developer Experience Features

**Quick Start Script:**
```bash
#!/bin/bash
# scripts/setup.sh
echo "🚀 Setting up Reference Validator..."

# Clone and install dependencies
npm install

# Copy environment file
cp .env.example .env

# Setup database
npm run db:setup

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

**GitHub Actions:**
```yaml
# .github/workflows/ci.yml
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### 5.3 Plugin System

**Provider Registry:**
```typescript
// src/lib/provider-registry.ts
export class ProviderRegistry {
  private static authProviders = new Map<string, AuthProvider>();
  private static emailProviders = new Map<string, EmailProvider>();
  private static nlpProviders = new Map<string, NLPProvider>();
  
  static registerAuthProvider(name: string, provider: AuthProvider) {
    this.authProviders.set(name, provider);
  }
  
  static getAuthProvider(name: string): AuthProvider {
    return this.authProviders.get(name) || new ClerkAuthProvider();
  }
}
```

## Implementation Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Foundation | Project setup, database schema, basic auth |
| 2 | Architecture | Provider system, core components, styling |
| 3 | Candidate Flow | Submission form, OAuth integration, email system |
| 4 | Referee System | Reference forms, validation logic, email templates |
| 5 | AI Integration | Scoring algorithms, LinkedIn parsing, analytics |
| 6 | Admin Dashboard | Dashboard UI, access controls, reporting |
| 7 | Open Source | Documentation, deployment guides, community setup |

## Success Metrics

**Technical Metrics:**
- 100% test coverage for core business logic
- < 2 second page load times
- 99.9% uptime for production deployments
- Zero critical security vulnerabilities

**Community Metrics:**
- 10+ forks within first month
- 5+ community contributions
- 3+ deployment guides (Vercel, Docker, Self-hosted)
- Active issue and PR engagement

## Risk Mitigation

**Technical Risks:**
- **LinkedIn API limitations:** Implement fallback scraping with rate limiting
- **Email deliverability:** Use Resend with proper SPF/DKIM setup
- **AI API costs:** Implement caching and local model fallbacks
- **Data privacy:** Encrypt sensitive data, implement data retention policies

**Community Risks:**
- **Low adoption:** Focus on developer experience and clear documentation
- **Maintenance burden:** Implement automated testing and CI/CD
- **Security concerns:** Regular security audits and vulnerability scanning

This implementation plan ensures the project is truly open source, developer-friendly, and systematically addresses all requirements from the PRD. 