// Core user types
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
  HR_MANAGER = 'hr_manager'
}

// Candidate types
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

// Employment history types
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

// Referee types
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

export interface RefereeValidation {
  isValid: boolean;
  confidence: number;
  flags: string[];
  domainCheck: boolean;
  linkedinCheck?: boolean;
}

// Reference response types
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

// AI scoring types
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

export interface ScoreBreakdown {
  credibility: {
    score: number;
    factors: string[];
  };
  integrity: {
    score: number;
    factors: string[];
  };
  achievements: {
    score: number;
    factors: string[];
  };
  rehire: {
    score: number;
    factors: string[];
  };
}

// Form types
export interface CandidateSubmissionForm {
  personalInfo: {
    fullName: string;
    email: string;
    currentEmploymentStatus: EmploymentStatus;
  };
  employmentHistory: EmploymentHistoryInput[];
  referees: RefereeInput[];
  documents: File[];
}

export interface EmploymentHistoryInput {
  companyName: string;
  jobTitle: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  achievements: string[];
}

export interface RefereeInput {
  name: string;
  email: string;
  company: string;
  role?: string;
  relationship?: string;
  employmentId?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard types
export interface DashboardStats {
  totalCandidates: number;
  pendingReferences: number;
  completedReferences: number;
  averageScore: number;
  flaggedCandidates: number;
}

export interface CandidateOverview {
  candidate: Candidate;
  employmentHistory: EmploymentHistory[];
  referees: Referee[];
  referenceResponses: ReferenceResponse[];
  scores?: CandidateScores;
  flags: string[];
  status: CandidateStatus;
}

export enum CandidateStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  COMPLETED = 'completed',
  FLAGGED = 'flagged'
}

// Email types
export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  template: string;
  data: Record<string, any>;
}

// Audit types
export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details: Record<string, any>;
  createdAt: Date;
}

// Provider types
export interface AuthProvider {
  authenticate(credentials: any): Promise<User>;
  verifyToken(token: string): Promise<User | null>;
  logout(): Promise<void>;
}

export interface EmailProvider {
  sendEmail(to: string, subject: string, content: string): Promise<void>;
  sendTemplate(template: string, data: EmailData): Promise<void>;
  verifyEmail(email: string): Promise<boolean>;
}

export interface NLPProvider {
  analyzeSentiment(text: string): Promise<number>;
  summarizeReferences(responses: ReferenceResponse[]): Promise<string>;
  generateScores(responses: ReferenceResponse[]): Promise<ScoreBreakdown>;
  extractEntities(text: string): Promise<Record<string, string[]>>;
}

// Configuration types
export interface AppConfig {
  auth: {
    provider: string;
    linkedinEnabled: boolean;
  };
  email: {
    provider: string;
    fromEmail: string;
    fromName: string;
  };
  ai: {
    provider: string;
    model: string;
    maxTokens: number;
  };
  security: {
    referenceLinkExpiryDays: number;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
}

// Utility types
export type WithId<T> = T & { id: string };
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>; 