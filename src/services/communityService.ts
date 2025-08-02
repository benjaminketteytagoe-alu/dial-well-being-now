import { supabase } from '@/integrations/supabase/client';

export interface CommunityForum {
  id: string;
  name: string;
  description: string;
  category: 'pcos' | 'fibroids' | 'maternal_health' | 'general_wellness' | 'mental_health' | 'nutrition' | 'exercise';
  is_peer_led: boolean;
  is_active: boolean;
  member_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ForumPost {
  id: string;
  forum_id: string;
  user_id: string;
  title: string;
  content: string;
  post_type: 'discussion' | 'question' | 'experience' | 'resource' | 'announcement';
  is_anonymous: boolean;
  likes_count: number;
  replies_count: number;
  views_count: number;
  is_pinned: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  likes_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export interface MentorshipProgram {
  id: string;
  title: string;
  description: string;
  category: 'pcos' | 'fibroids' | 'maternal_health' | 'general_wellness' | 'mental_health';
  mentor_id?: string;
  max_participants: number;
  current_participants: number;
  duration_weeks?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoachingSession {
  id: string;
  coach_id?: string;
  user_id: string;
  session_type: 'nutrition' | 'exercise' | 'mental_health' | 'lifestyle' | 'stress_management';
  session_date: string;
  session_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  goals?: string;
  outcomes?: string;
  created_at: string;
  updated_at: string;
}

export class CommunityService {
  // Mock implementations until community tables are created
  static async getForums(): Promise<CommunityForum[]> {
    // Return mock data for now
    return [
      {
        id: '1',
        name: 'PCOS Support Group',
        description: 'A supportive community for women with PCOS',
        category: 'pcos',
        is_peer_led: true,
        is_active: true,
        member_count: 156,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Fibroids Awareness',
        description: 'Educational discussions about uterine fibroids',
        category: 'fibroids',
        is_peer_led: false,
        is_active: true,
        member_count: 89,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  static async getForumPosts(forumId: string, limit: number = 20, offset: number = 0): Promise<ForumPost[]> {
    return [];
  }

  static async createForumPost(
    userId: string,
    forumId: string,
    title: string,
    content: string,
    postType: 'discussion' | 'question' | 'experience' | 'resource' | 'announcement' = 'discussion',
    isAnonymous: boolean = false
  ): Promise<ForumPost> {
    throw new Error('Community features are not yet available. Please check back soon!');
  }

  static async getForumReplies(postId: string): Promise<ForumReply[]> {
    return [];
  }

  static async createForumReply(
    userId: string,
    postId: string,
    content: string,
    isAnonymous: boolean = false
  ): Promise<ForumReply> {
    throw new Error('Community features are not yet available. Please check back soon!');
  }

  static async getMentorshipPrograms(): Promise<MentorshipProgram[]> {
    return [];
  }

  static async joinMentorshipProgram(userId: string, programId: string): Promise<void> {
    throw new Error('Mentorship features are not yet available. Please check back soon!');
  }

  static async getUserCoachingSessions(userId: string): Promise<CoachingSession[]> {
    return [];
  }

  static async bookCoachingSession(
    userId: string,
    sessionType: 'nutrition' | 'exercise' | 'mental_health' | 'lifestyle' | 'stress_management',
    sessionDate: string,
    sessionTime: string,
    durationMinutes: number = 60,
    goals?: string
  ): Promise<CoachingSession> {
    throw new Error('Coaching features are not yet available. Please check back soon!');
  }

  static async likeContent(contentType: 'post' | 'reply', contentId: string): Promise<void> {
    throw new Error('Community features are not yet available. Please check back soon!');
  }

  static async searchCommunity(query: string): Promise<{ forums: CommunityForum[], posts: ForumPost[] }> {
    const forums = await this.getForums();
    return {
      forums: forums.filter(f => 
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.description.toLowerCase().includes(query.toLowerCase())
      ),
      posts: []
    };
  }
}