import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser usage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey
);

// Database helper functions
export class DatabaseService {
  // Candidate operations
  static async createCandidate(candidate: Omit<Database['public']['Tables']['candidates']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('candidates')
      .insert(candidate)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCandidate(id: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async getCandidateByEmail(email: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCandidate(id: string, updates: Partial<Database['public']['Tables']['candidates']['Update']>) {
    const { data, error } = await supabaseAdmin
      .from('candidates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Employment history operations
  static async createEmploymentHistory(employment: Omit<Database['public']['Tables']['employment_history']['Insert'], 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('employment_history')
      .insert(employment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getEmploymentHistory(candidateId: string) {
    const { data, error } = await supabase
      .from('employment_history')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateEmploymentHistory(id: string, updates: Partial<Database['public']['Tables']['employment_history']['Update']>) {
    const { data, error } = await supabaseAdmin
      .from('employment_history')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Referee operations
  static async createReferee(referee: Omit<Database['public']['Tables']['referees']['Insert'], 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('referees')
      .insert(referee)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getReferees(candidateId: string) {
    const { data, error } = await supabase
      .from('referees')
      .select('*')
      .eq('candidate_id', candidateId);

    if (error) throw error;
    return data;
  }

  static async getReferee(id: string) {
    const { data, error } = await supabase
      .from('referees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateReferee(id: string, updates: Partial<Database['public']['Tables']['referees']['Update']>) {
    const { data, error } = await supabaseAdmin
      .from('referees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Reference response operations
  static async createReferenceResponse(response: Omit<Database['public']['Tables']['reference_responses']['Insert'], 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('reference_responses')
      .insert(response)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getReferenceResponseByToken(token: string) {
    const { data, error } = await supabase
      .from('reference_responses')
      .select('*')
      .eq('token', token)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateReferenceResponse(id: string, updates: Partial<Database['public']['Tables']['reference_responses']['Update']>) {
    const { data, error } = await supabaseAdmin
      .from('reference_responses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getReferenceResponses(refereeId: string) {
    const { data, error } = await supabase
      .from('reference_responses')
      .select('*')
      .eq('referee_id', refereeId);

    if (error) throw error;
    return data;
  }

  // AI scores operations
  static async createAIScores(scores: Omit<Database['public']['Tables']['ai_scores']['Insert'], 'id' | 'analysis_date'>) {
    const { data, error } = await supabaseAdmin
      .from('ai_scores')
      .insert(scores)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAIScores(candidateId: string) {
    const { data, error } = await supabase
      .from('ai_scores')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('analysis_date', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  }

  // Admin operations
  static async createAdminUser(admin: Omit<Database['public']['Tables']['admin_users']['Insert'], 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert(admin)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAdminUser(email: string) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }

  // Audit log operations
  static async createAuditLog(log: Omit<Database['public']['Tables']['audit_logs']['Insert'], 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAuditLogs(filters?: {
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters?.resourceType) {
      query = query.eq('resource_type', filters.resourceType);
    }
    if (filters?.resourceId) {
      query = query.eq('resource_id', filters.resourceId);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Dashboard queries
  static async getDashboardStats(): Promise<{
    totalCandidates: number;
    pendingReferences: number;
    completedReferences: number;
    averageScore: number;
    flaggedCandidates: number;
  }> {
    // Get total candidates
    const { count: totalCandidates } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true });

    // Get pending references (referees without responses)
    const { count: pendingReferences } = await supabase
      .from('referees')
      .select('*', { count: 'exact', head: true })
      .is('reference_responses.submitted_at', null);

    // Get completed references
    const { count: completedReferences } = await supabase
      .from('reference_responses')
      .select('*', { count: 'exact', head: true })
      .not('submitted_at', 'is', null);

    // Get average score
    const { data: scores } = await supabase
      .from('ai_scores')
      .select('credibility_score, integrity_score, achievement_score, rehire_score');

    const averageScore = scores?.length
      ? scores.reduce((acc, score) => {
          const avg = (score.credibility_score + score.integrity_score + score.achievement_score + score.rehire_score) / 4;
          return acc + avg;
        }, 0) / scores.length
      : 0;

    // Get flagged candidates (scores below threshold)
    const { count: flaggedCandidates } = await supabase
      .from('ai_scores')
      .select('*', { count: 'exact', head: true })
      .or('credibility_score.lt.0.6,integrity_score.lt.0.6,achievement_score.lt.0.6,rehire_score.lt.0.6');

    return {
      totalCandidates: totalCandidates || 0,
      pendingReferences: pendingReferences || 0,
      completedReferences: completedReferences || 0,
      averageScore: Math.round(averageScore * 100) / 100,
      flaggedCandidates: flaggedCandidates || 0,
    };
  }

  static async getCandidateOverview(candidateId: string) {
    const { data: candidate } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    const { data: employmentHistory } = await supabase
      .from('employment_history')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('start_date', { ascending: false });

    const { data: referees } = await supabase
      .from('referees')
      .select('*')
      .eq('candidate_id', candidateId);

    const { data: referenceResponses } = await supabase
      .from('reference_responses')
      .select('*')
      .in('referee_id', referees?.map(r => r.id) || []);

    const { data: scores } = await supabase
      .from('ai_scores')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('analysis_date', { ascending: false })
      .limit(1)
      .single();

    // Determine status based on responses and scores
    let status = 'pending';
    if (referenceResponses?.length && referenceResponses.every(r => r.submitted_at)) {
      status = scores ? 'completed' : 'in_review';
    }
    if (scores && (scores.credibility_score < 0.6 || scores.integrity_score < 0.6)) {
      status = 'flagged';
    }

    // Identify flags
    const flags: string[] = [];
    if (referees?.some(r => !r.isVerified)) flags.push('unverified_referees');
    if (scores?.credibility_score < 0.6) flags.push('low_credibility');
    if (scores?.integrity_score < 0.6) flags.push('integrity_concerns');
    if (scores?.achievement_score < 0.6) flags.push('achievement_mismatch');
    if (scores?.rehire_score < 0.6) flags.push('rehire_concerns');

    return {
      candidate,
      employmentHistory: employmentHistory || [],
      referees: referees || [],
      referenceResponses: referenceResponses || [],
      scores,
      flags,
      status,
    };
  }
}

// File storage utilities
export class StorageService {
  static async uploadFile(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(path, file);

    if (error) throw error;
    return data;
  }

  static async getFileUrl(path: string) {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(path);

    return data.publicUrl;
  }

  static async deleteFile(path: string) {
    const { error } = await supabase.storage
      .from('documents')
      .remove([path]);

    if (error) throw error;
  }
} 