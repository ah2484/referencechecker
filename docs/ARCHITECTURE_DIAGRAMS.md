# Architecture Diagrams - Reference Validator

## 🔄 **System Overview**

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App] --> B[React Components]
        B --> C[Provider Registry]
    end
    
    subgraph "Provider Layer"
        C --> D[Auth Providers]
        C --> E[Database Providers]
        C --> F[Email Providers]
        C --> G[AI/NLP Providers]
        C --> H[Storage Providers]
        C --> I[Blockchain Providers]
    end
    
    subgraph "External Services"
        D --> J[Clerk/Auth0/Custom]
        E --> K[Supabase/Firebase/PostgreSQL]
        F --> L[Resend/SendGrid/AWS SES]
        G --> M[OpenAI/Anthropic/Local]
        H --> N[AWS S3/Google Cloud/IPFS]
        I --> O[Ethereum/Polygon/Solana]
    end
    
    style A fill:#e3f2fd
    style C fill:#fff3e0
    style J fill:#f3e5f5
    style K fill:#e8f5e8
    style L fill:#fff8e1
    style M fill:#fce4ec
    style N fill:#f1f8e9
    style O fill:#e0f2f1
```

## 👤 **User Journey Flows**

### **Candidate Journey**

```mermaid
sequenceDiagram
    participant C as Candidate
    participant F as Frontend
    participant A as Auth Provider
    participant D as Database
    participant L as LinkedIn
    participant E as Email Provider
    participant R as Referee
    participant AI as AI Provider
    
    C->>F: Submit Application
    F->>A: Authenticate
    A-->>F: User Session
    F->>L: OAuth Integration
    L-->>F: Employment History
    F->>D: Store Candidate Data
    F->>E: Send Reference Requests
    E->>R: Email to Referees
    R->>F: Submit Reference
    F->>AI: Analyze Response
    AI-->>F: Risk Assessment
    F->>D: Update Records
    F-->>C: Verification Complete
```

### **Referee Journey**

```mermaid
sequenceDiagram
    participant R as Referee
    participant E as Email
    participant F as Frontend
    participant A as Auth Provider
    participant D as Database
    participant AI as AI Provider
    
    E->>R: Reference Request Email
    R->>F: Click Secure Link
    F->>A: Verify Token
    A-->>F: Authenticated
    F->>R: Show Reference Form
    R->>F: Submit Reference
    F->>AI: Process Response
    AI-->>F: Analysis Results
    F->>D: Store Response
    F-->>R: Thank You Message
```

### **Admin Journey**

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant D as Database
    participant AI as AI Provider
    participant B as Blockchain
    participant VC as Verifiable Credentials
    
    A->>F: Login to Dashboard
    F->>D: Fetch Candidates
    D-->>F: Candidate Data
    F->>AI: Get Analysis
    AI-->>F: Risk Scores
    F-->>A: Dashboard View
    A->>F: Review Candidate
    F->>VC: Generate Credential
    VC->>B: Store on Blockchain
    B-->>VC: Transaction Hash
    VC-->>F: Credential Issued
    F-->>A: Success Confirmation
```

## 🏗️ **Technical Architecture**

### **Provider Registry System**

```mermaid
graph LR
    subgraph "Application Core"
        A[Provider Registry]
        B[Interface Layer]
        C[Business Logic]
    end
    
    subgraph "Provider Implementations"
        D[Mock Providers]
        E[Supabase Provider]
        F[Clerk Provider]
        G[Custom Providers]
    end
    
    subgraph "External Services"
        H[Supabase]
        I[Clerk]
        J[Custom APIs]
    end
    
    A --> B
    B --> C
    A --> D
    A --> E
    A --> F
    A --> G
    E --> H
    F --> I
    G --> J
    
    style A fill:#fff3e0
    style B fill:#e8f5e8
    style C fill:#f3e5f5
```

### **Data Flow Architecture**

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[Next.js Pages]
        B[React Components]
        C[API Routes]
    end
    
    subgraph "Business Logic Layer"
        D[Provider Registry]
        E[Service Layer]
        F[Validation Layer]
    end
    
    subgraph "Data Layer"
        G[Database Providers]
        H[External APIs]
        I[File Storage]
    end
    
    subgraph "Infrastructure Layer"
        J[Authentication]
        K[Email Services]
        L[AI Services]
        M[Blockchain]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
    G --> J
    G --> K
    G --> L
    G --> M
    
    style A fill:#e3f2fd
    style D fill:#fff3e0
    style G fill:#e8f5e8
    style J fill:#f3e5f5
```

## 🔐 **Security & Privacy Architecture**

### **Authentication Flow**

```mermaid
graph TD
    A[User Request] --> B{Authenticated?}
    B -->|No| C[Redirect to Auth]
    C --> D[OAuth Provider]
    D --> E[User Consent]
    E --> F[Callback with Token]
    F --> G[Verify Token]
    G --> H[Create Session]
    H --> I[Access Granted]
    B -->|Yes| I
    
    style A fill:#e1f5fe
    style I fill:#c8e6c9
    style D fill:#fff3e0
```

### **Verifiable Credentials Flow**

#### **Mermaid Diagram**
```mermaid
graph TD
    A[Employment Verified] --> B[Generate Credential]
    B --> C[Sign with Issuer Key]
    C --> D[Store on IPFS]
    D --> E[Hash on Blockchain]
    E --> F[Issue to Candidate]
    F --> G[Store in Wallet]
    G --> H[Selective Disclosure]
    H --> I[Future Verification]
    
    style A fill:#e1f5fe
    style I fill:#c8e6c9
    style E fill:#fff3e0
    style G fill:#f3e5f5
```

#### **ASCII Flow Diagram**
```
          +-------------------------+
          |  Previous Employer (HR)|
          | Issues Verifiable Cred |
          +-----------+------------+
                      |
                      v
          +-------------------------+
          | Off-chain VC Storage    |
          | (IPFS, Ceramic, etc)    |
          +-----------+------------+
                      |
                      v
          +-------------------------+
          |  Hash posted on-chain   |
          |  (e.g. Ethereum, Polygon)|
          +-----------+------------+
                      |
                      v
          +-------------------------+
          | Candidate submits claims|
          | + VCs to new employer   |
          +-----------+------------+
                      |
                      v
          +-------------------------+
          | New Employer verifies   |
          | claims + VCs + red flags|
          +-------------------------+
```

## 📊 **Data Models**

### **Core Entities**

```mermaid
erDiagram
    CANDIDATE {
        string id PK
        string email
        string fullName
        string linkedinId
        enum employmentStatus
        datetime createdAt
        datetime updatedAt
    }
    
    EMPLOYMENT_HISTORY {
        string id PK
        string candidateId FK
        string companyName
        string jobTitle
        datetime startDate
        datetime endDate
        boolean isCurrent
        array achievements
        array documentsUrls
        datetime createdAt
    }
    
    REFEREE {
        string id PK
        string candidateId FK
        string employmentId FK
        string name
        string email
        string company
        string role
        string relationship
        string emailDomain
        boolean isVerified
        datetime createdAt
    }
    
    REFERENCE_RESPONSE {
        string id PK
        string refereeId FK
        string token
        string relationship
        string roleConfirmation
        string durationConfirmation
        boolean wouldRehire
        boolean returnedProperty
        boolean leftOnGoodTerms
        boolean achievementsAligned
        string concerns
        string additionalComments
        datetime submittedAt
        datetime expiresAt
        datetime createdAt
    }
    
    CANDIDATE_SCORES {
        string id PK
        string candidateId FK
        number credibilityScore
        number integrityScore
        number achievementScore
        number rehireScore
        string summary
        datetime analysisDate
    }
    
    CANDIDATE ||--o{ EMPLOYMENT_HISTORY : has
    CANDIDATE ||--o{ REFEREE : has
    EMPLOYMENT_HISTORY ||--o{ REFEREE : references
    REFEREE ||--o{ REFERENCE_RESPONSE : provides
    CANDIDATE ||--o| CANDIDATE_SCORES : has
```

## 🚀 **Deployment Architecture**

### **Production Deployment**

```mermaid
graph TB
    subgraph "CDN Layer"
        A[Vercel Edge Network]
        B[Static Assets]
    end
    
    subgraph "Application Layer"
        C[Next.js App]
        D[API Routes]
        E[Serverless Functions]
    end
    
    subgraph "Service Layer"
        F[Provider Registry]
        G[External Services]
    end
    
    subgraph "Data Layer"
        H[Database]
        I[File Storage]
        J[Blockchain]
    end
    
    A --> B
    A --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    G --> I
    G --> J
    
    style A fill:#e3f2fd
    style C fill:#fff3e0
    style F fill:#e8f5e8
    style H fill:#f3e5f5
```

### **Development Environment**

```mermaid
graph TB
    subgraph "Local Development"
        A[Next.js Dev Server]
        B[Mock Providers]
        C[Local Database]
    end
    
    subgraph "External Services"
        D[Supabase Local]
        E[Clerk Dev]
        F[Email Testing]
    end
    
    A --> B
    B --> C
    A --> D
    A --> E
    A --> F
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style D fill:#e8f5e8
```

## 🔄 **Provider Integration Patterns**

### **Standard Provider Pattern**

```mermaid
graph TD
    A[Provider Interface] --> B[Provider Implementation]
    B --> C[External Service]
    C --> D[Response Processing]
    D --> E[Data Transformation]
    E --> F[Return Result]
    
    style A fill:#fff3e0
    style B fill:#e8f5e8
    style C fill:#f3e5f5
```

### **Provider Registry Pattern**

```mermaid
graph TD
    A[Application] --> B[Provider Registry]
    B --> C{Provider Type}
    C -->|Auth| D[Auth Provider]
    C -->|Database| E[Database Provider]
    C -->|Email| F[Email Provider]
    C -->|AI| G[AI Provider]
    
    D --> H[External Auth Service]
    E --> I[External Database]
    F --> J[External Email Service]
    G --> K[External AI Service]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style H fill:#f3e5f5
    style I fill:#e8f5e8
    style J fill:#fff8e1
    style K fill:#fce4ec
```

---

*These diagrams are living documents and will be updated as the architecture evolves. They provide a visual representation of the system's design and can be used for development planning and documentation.* 