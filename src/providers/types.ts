// Core provider interfaces for the reference validator system
// These interfaces allow developers to implement their own providers

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  linkedinId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CANDIDATE = 'candidate',
  REFEREE = 'referee',
  ADMIN = 'admin',
  HR_MANAGER = 'hr_manager',
  CREDENTIAL_ISSUER = 'credential_issuer'
}

export interface Candidate {
  id: string;
  email: string;
  linkedinId?: string;
  fullName: string;
  currentEmploymentStatus: EmploymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum EmploymentStatus {
  EMPLOYED = 'employed',
  UNEMPLOYED = 'unemployed',
  FREELANCING = 'freelancing',
  CONTRACTING = 'contracting',
  STUDENT = 'student'
}

export interface EmploymentHistory {
  id: string;
  candidateId: string;
  companyName: string;
  jobTitle: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  achievements: string[];
  documentsUrls: string[];
  createdAt: Date;
}

export interface Referee {
  id: string;
  candidateId: string;
  employmentId: string;
  name: string;
  email: string;
  company: string;
  role?: string;
  relationship?: string;
  emailDomain: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface ReferenceResponse {
  id: string;
  refereeId: string;
  token: string;
  relationship?: string;
  roleConfirmation?: string;
  durationConfirmation?: string;
  wouldRehire?: boolean;
  returnedProperty?: boolean;
  leftOnGoodTerms?: boolean;
  achievementsAligned?: boolean;
  concerns?: string;
  additionalComments?: string;
  submittedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}

export interface CandidateScores {
  id: string;
  candidateId: string;
  credibilityScore: number;
  integrityScore: number;
  achievementScore: number;
  rehireScore: number;
  summary: string;
  analysisDate: Date;
}

// ===== PROVIDER INTERFACES =====

/**
 * Authentication Provider Interface
 * Implement this to use any authentication service (Clerk, Auth0, custom, etc.)
 */
export interface AuthProvider {
  /**
   * Authenticate a user with credentials
   */
  authenticate(credentials: any): Promise<User>;
  
  /**
   * Verify a token and return user
   */
  verifyToken(token: string): Promise<User | null>;
  
  /**
   * Logout the current user
   */
  logout(): Promise<void>;
  
  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Promise<boolean>;
  
  /**
   * Get authentication URL for OAuth providers
   */
  getAuthUrl(provider: string): string;
}

/**
 * Database Provider Interface
 * Implement this to use any database (Supabase, Firebase, PostgreSQL, MongoDB, etc.)
 */
export interface DatabaseProvider {
  // Candidate operations
  createCandidate(candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate>;
  getCandidate(id: string): Promise<Candidate | null>;
  getCandidateByEmail(email: string): Promise<Candidate | null>;
  updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate>;
  deleteCandidate(id: string): Promise<void>;
  
  // Employment history operations
  createEmploymentHistory(employment: Omit<EmploymentHistory, 'id' | 'createdAt'>): Promise<EmploymentHistory>;
  getEmploymentHistory(candidateId: string): Promise<EmploymentHistory[]>;
  updateEmploymentHistory(id: string, updates: Partial<EmploymentHistory>): Promise<EmploymentHistory>;
  deleteEmploymentHistory(id: string): Promise<void>;
  
  // Referee operations
  createReferee(referee: Omit<Referee, 'id' | 'createdAt'>): Promise<Referee>;
  getReferees(candidateId: string): Promise<Referee[]>;
  getReferee(id: string): Promise<Referee | null>;
  updateReferee(id: string, updates: Partial<Referee>): Promise<Referee>;
  deleteReferee(id: string): Promise<void>;
  
  // Reference response operations
  createReferenceResponse(response: Omit<ReferenceResponse, 'id' | 'createdAt'>): Promise<ReferenceResponse>;
  getReferenceResponseByToken(token: string): Promise<ReferenceResponse | null>;
  updateReferenceResponse(id: string, updates: Partial<ReferenceResponse>): Promise<ReferenceResponse>;
  getReferenceResponses(refereeId: string): Promise<ReferenceResponse[]>;
  
  // AI scores operations
  createAIScores(scores: Omit<CandidateScores, 'id' | 'analysisDate'>): Promise<CandidateScores>;
  getAIScores(candidateId: string): Promise<CandidateScores | null>;
  
  // Dashboard queries
  getDashboardStats(): Promise<{
    totalCandidates: number;
    pendingReferences: number;
    completedReferences: number;
    averageScore: number;
    flaggedCandidates: number;
  }>;
  
  getCandidateOverview(candidateId: string): Promise<{
    candidate: Candidate;
    employmentHistory: EmploymentHistory[];
    referees: Referee[];
    referenceResponses: ReferenceResponse[];
    scores?: CandidateScores;
    flags: string[];
    status: string;
  }>;
}

/**
 * Email Provider Interface
 * Implement this to use any email service (Resend, SendGrid, AWS SES, etc.)
 */
export interface EmailProvider {
  /**
   * Send a simple email
   */
  sendEmail(to: string, subject: string, content: string): Promise<void>;
  
  /**
   * Send email using a template
   */
  sendTemplate(template: string, data: EmailData): Promise<void>;
  
  /**
   * Verify if an email address is valid
   */
  verifyEmail(email: string): Promise<boolean>;
  
  /**
   * Get email delivery status
   */
  getDeliveryStatus(messageId: string): Promise<EmailDeliveryStatus>;
}

export interface EmailData {
  to: string;
  template: string;
  data: Record<string, any>;
}

export interface EmailDeliveryStatus {
  messageId: string;
  status: 'delivered' | 'failed' | 'pending';
  deliveredAt?: Date;
  error?: string;
}

/**
 * AI/NLP Provider Interface
 * Implement this to use any AI service (OpenAI, Anthropic, local models, etc.)
 */
export interface NLPProvider {
  /**
   * Analyze sentiment of text
   */
  analyzeSentiment(text: string): Promise<number>;
  
  /**
   * Summarize reference responses
   */
  summarizeReferences(responses: ReferenceResponse[]): Promise<string>;
  
  /**
   * Generate scores from reference responses
   */
  generateScores(responses: ReferenceResponse[]): Promise<{
    credibility: { score: number; factors: string[] };
    integrity: { score: number; factors: string[] };
    achievements: { score: number; factors: string[] };
    rehire: { score: number; factors: string[] };
  }>;
  
  /**
   * Extract entities from text
   */
  extractEntities(text: string): Promise<Record<string, string[]>>;
  
  /**
   * Check for potential red flags in text
   */
  detectRedFlags(text: string): Promise<string[]>;
}

/**
 * File Storage Provider Interface
 * Implement this to use any storage service (AWS S3, Google Cloud Storage, local, etc.)
 */
export interface StorageProvider {
  /**
   * Upload a file
   */
  uploadFile(file: File, path: string): Promise<string>;
  
  /**
   * Get file URL
   */
  getFileUrl(path: string): Promise<string>;
  
  /**
   * Delete a file
   */
  deleteFile(path: string): Promise<void>;
  
  /**
   * Check if file exists
   */
  fileExists(path: string): Promise<boolean>;
}

/**
 * Blockchain Provider Interface
 * Implement this to use any blockchain (Ethereum, Polygon, Solana, etc.)
 */
export interface BlockchainProvider {
  /**
   * Issue a credential on blockchain
   */
  issueCredential(credentialHash: string): Promise<string>;
  
  /**
   * Verify a credential on blockchain
   */
  verifyCredential(credentialHash: string): Promise<boolean>;
  
  /**
   * Get transaction status
   */
  getTransactionStatus(txHash: string): Promise<'pending' | 'confirmed' | 'failed'>;
  
  /**
   * Get network information
   */
  getNetworkInfo(): Promise<{
    chainId: number;
    networkName: string;
    blockHeight: number;
  }>;
}

/**
 * Verifiable Credentials Provider Interface
 * Implement this to use any VC framework (W3C, Hyperledger, etc.)
 */
export interface VerifiableCredentialProvider {
  /**
   * Issue a verifiable credential
   */
  issueCredential(subject: string, claims: any, issuerKey: string): Promise<any>;
  
  /**
   * Verify a verifiable credential
   */
  verifyCredential(credential: any): Promise<boolean>;
  
  /**
   * Create a selective disclosure credential
   */
  createSelectiveCredential(credential: any, disclosedFields: string[]): Promise<any>;
  
  /**
   * Generate proof for a credential
   */
  generateProof(credential: any, publicInputs: any): Promise<any>;
}

/**
 * Zero-Knowledge Proof Provider Interface
 * Implement this to use any ZK framework (Semaphore, Circom, etc.)
 */
export interface ZKProofProvider {
  /**
   * Generate a ZK proof
   */
  generateProof(witness: any, publicInputs: any): Promise<any>;
  
  /**
   * Verify a ZK proof
   */
  verifyProof(proof: any, publicInputs: any): Promise<boolean>;
  
  /**
   * Load a circuit
   */
  loadCircuit(circuitName: string): Promise<any>;
  
  /**
   * Generate witness from data
   */
  generateWitness(data: any): Promise<any>;
} 