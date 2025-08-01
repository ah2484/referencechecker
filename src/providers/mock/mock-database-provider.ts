import { 
  DatabaseProvider, 
  Candidate, 
  EmploymentHistory, 
  Referee, 
  ReferenceResponse, 
  CandidateScores,
  EmploymentStatus 
} from '../types';

/**
 * Mock Database Provider
 * 
 * This is a simple in-memory implementation for development and testing.
 * Developers can replace this with their own database provider.
 */
export class MockDatabaseProvider implements DatabaseProvider {
  private candidates: Map<string, Candidate> = new Map();
  private employmentHistory: Map<string, EmploymentHistory> = new Map();
  private referees: Map<string, Referee> = new Map();
  private referenceResponses: Map<string, ReferenceResponse> = new Map();
  private aiScores: Map<string, CandidateScores> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock candidate
    const candidate: Candidate = {
      id: '1',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      linkedinId: 'linkedin-123',
      currentEmploymentStatus: EmploymentStatus.EMPLOYED,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.candidates.set(candidate.id, candidate);

    // Mock employment history
    const employment: EmploymentHistory = {
      id: '1',
      candidateId: '1',
      companyName: 'Tech Corp',
      jobTitle: 'Senior Software Engineer',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2024-01-01'),
      isCurrent: false,
      achievements: ['Led team of 5 developers', 'Improved performance by 40%'],
      documentsUrls: ['https://example.com/doc1.pdf'],
      createdAt: new Date()
    };
    this.employmentHistory.set(employment.id, employment);

    // Mock referee
    const referee: Referee = {
      id: '1',
      candidateId: '1',
      employmentId: '1',
      name: 'Jane Smith',
      email: 'jane.smith@techcorp.com',
      company: 'Tech Corp',
      role: 'Engineering Manager',
      relationship: 'Direct Manager',
      emailDomain: 'techcorp.com',
      isVerified: true,
      createdAt: new Date()
    };
    this.referees.set(referee.id, referee);

    // Mock reference response
    const response: ReferenceResponse = {
      id: '1',
      refereeId: '1',
      token: 'mock-token-123',
      relationship: 'Direct Manager',
      roleConfirmation: 'Senior Software Engineer',
      durationConfirmation: '2 years',
      wouldRehire: true,
      returnedProperty: true,
      leftOnGoodTerms: true,
      achievementsAligned: true,
      concerns: '',
      additionalComments: 'Excellent team player and technical leader.',
      submittedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date()
    };
    this.referenceResponses.set(response.id, response);

    // Mock AI scores
    const scores: CandidateScores = {
      id: '1',
      candidateId: '1',
      credibilityScore: 85,
      integrityScore: 90,
      achievementScore: 88,
      rehireScore: 92,
      summary: 'Strong candidate with excellent references and proven track record.',
      analysisDate: new Date()
    };
    this.aiScores.set(scores.id, scores);
  }

  // Candidate operations
  async createCandidate(candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> {
    const id = Date.now().toString();
    const newCandidate: Candidate = {
      ...candidate,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.candidates.set(id, newCandidate);
    return newCandidate;
  }

  async getCandidate(id: string): Promise<Candidate | null> {
    return this.candidates.get(id) || null;
  }

  async getCandidateByEmail(email: string): Promise<Candidate | null> {
    for (const candidate of this.candidates.values()) {
      if (candidate.email === email) {
        return candidate;
      }
    }
    return null;
  }

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate> {
    const candidate = this.candidates.get(id);
    if (!candidate) {
      throw new Error(`Candidate with id ${id} not found`);
    }
    
    const updatedCandidate: Candidate = {
      ...candidate,
      ...updates,
      updatedAt: new Date()
    };
    this.candidates.set(id, updatedCandidate);
    return updatedCandidate;
  }

  async deleteCandidate(id: string): Promise<void> {
    this.candidates.delete(id);
  }

  // Employment history operations
  async createEmploymentHistory(employment: Omit<EmploymentHistory, 'id' | 'createdAt'>): Promise<EmploymentHistory> {
    const id = Date.now().toString();
    const newEmployment: EmploymentHistory = {
      ...employment,
      id,
      createdAt: new Date()
    };
    this.employmentHistory.set(id, newEmployment);
    return newEmployment;
  }

  async getEmploymentHistory(candidateId: string): Promise<EmploymentHistory[]> {
    return Array.from(this.employmentHistory.values())
      .filter(emp => emp.candidateId === candidateId);
  }

  async updateEmploymentHistory(id: string, updates: Partial<EmploymentHistory>): Promise<EmploymentHistory> {
    const employment = this.employmentHistory.get(id);
    if (!employment) {
      throw new Error(`Employment history with id ${id} not found`);
    }
    
    const updatedEmployment: EmploymentHistory = {
      ...employment,
      ...updates
    };
    this.employmentHistory.set(id, updatedEmployment);
    return updatedEmployment;
  }

  async deleteEmploymentHistory(id: string): Promise<void> {
    this.employmentHistory.delete(id);
  }

  // Referee operations
  async createReferee(referee: Omit<Referee, 'id' | 'createdAt'>): Promise<Referee> {
    const id = Date.now().toString();
    const newReferee: Referee = {
      ...referee,
      id,
      createdAt: new Date()
    };
    this.referees.set(id, newReferee);
    return newReferee;
  }

  async getReferees(candidateId: string): Promise<Referee[]> {
    return Array.from(this.referees.values())
      .filter(ref => ref.candidateId === candidateId);
  }

  async getReferee(id: string): Promise<Referee | null> {
    return this.referees.get(id) || null;
  }

  async updateReferee(id: string, updates: Partial<Referee>): Promise<Referee> {
    const referee = this.referees.get(id);
    if (!referee) {
      throw new Error(`Referee with id ${id} not found`);
    }
    
    const updatedReferee: Referee = {
      ...referee,
      ...updates
    };
    this.referees.set(id, updatedReferee);
    return updatedReferee;
  }

  async deleteReferee(id: string): Promise<void> {
    this.referees.delete(id);
  }

  // Reference response operations
  async createReferenceResponse(response: Omit<ReferenceResponse, 'id' | 'createdAt'>): Promise<ReferenceResponse> {
    const id = Date.now().toString();
    const newResponse: ReferenceResponse = {
      ...response,
      id,
      createdAt: new Date()
    };
    this.referenceResponses.set(id, newResponse);
    return newResponse;
  }

  async getReferenceResponseByToken(token: string): Promise<ReferenceResponse | null> {
    for (const response of this.referenceResponses.values()) {
      if (response.token === token) {
        return response;
      }
    }
    return null;
  }

  async updateReferenceResponse(id: string, updates: Partial<ReferenceResponse>): Promise<ReferenceResponse> {
    const response = this.referenceResponses.get(id);
    if (!response) {
      throw new Error(`Reference response with id ${id} not found`);
    }
    
    const updatedResponse: ReferenceResponse = {
      ...response,
      ...updates
    };
    this.referenceResponses.set(id, updatedResponse);
    return updatedResponse;
  }

  async getReferenceResponses(refereeId: string): Promise<ReferenceResponse[]> {
    return Array.from(this.referenceResponses.values())
      .filter(resp => resp.refereeId === refereeId);
  }

  // AI scores operations
  async createAIScores(scores: Omit<CandidateScores, 'id' | 'analysisDate'>): Promise<CandidateScores> {
    const id = Date.now().toString();
    const newScores: CandidateScores = {
      ...scores,
      id,
      analysisDate: new Date()
    };
    this.aiScores.set(id, newScores);
    return newScores;
  }

  async getAIScores(candidateId: string): Promise<CandidateScores | null> {
    for (const scores of this.aiScores.values()) {
      if (scores.candidateId === candidateId) {
        return scores;
      }
    }
    return null;
  }

  // Dashboard queries
  async getDashboardStats(): Promise<{
    totalCandidates: number;
    pendingReferences: number;
    completedReferences: number;
    averageScore: number;
    flaggedCandidates: number;
  }> {
    const totalCandidates = this.candidates.size;
    const pendingReferences = Array.from(this.referenceResponses.values())
      .filter(resp => !resp.submittedAt).length;
    const completedReferences = Array.from(this.referenceResponses.values())
      .filter(resp => resp.submittedAt).length;
    
    const scores = Array.from(this.aiScores.values());
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score.credibilityScore, 0) / scores.length 
      : 0;
    
    const flaggedCandidates = 0; // Mock implementation

    return {
      totalCandidates,
      pendingReferences,
      completedReferences,
      averageScore,
      flaggedCandidates
    };
  }

  async getCandidateOverview(candidateId: string): Promise<{
    candidate: Candidate;
    employmentHistory: EmploymentHistory[];
    referees: Referee[];
    referenceResponses: ReferenceResponse[];
    scores?: CandidateScores;
    flags: string[];
    status: string;
  }> {
    const candidate = await this.getCandidate(candidateId);
    if (!candidate) {
      throw new Error(`Candidate with id ${candidateId} not found`);
    }

    const employmentHistory = await this.getEmploymentHistory(candidateId);
    const referees = await this.getReferees(candidateId);
    const referenceResponses = await this.getReferenceResponses(candidateId);
    const scores = await this.getAIScores(candidateId);

    return {
      candidate,
      employmentHistory,
      referees,
      referenceResponses,
      scores,
      flags: [], // Mock implementation
      status: 'active' // Mock implementation
    };
  }

  // Mock-specific methods for testing
  clearAll() {
    this.candidates.clear();
    this.employmentHistory.clear();
    this.referees.clear();
    this.referenceResponses.clear();
    this.aiScores.clear();
  }

  getAllCandidates(): Candidate[] {
    return Array.from(this.candidates.values());
  }

  getAllEmploymentHistory(): EmploymentHistory[] {
    return Array.from(this.employmentHistory.values());
  }

  getAllReferees(): Referee[] {
    return Array.from(this.referees.values());
  }

  getAllReferenceResponses(): ReferenceResponse[] {
    return Array.from(this.referenceResponses.values());
  }

  getAllAIScores(): CandidateScores[] {
    return Array.from(this.aiScores.values());
  }
} 