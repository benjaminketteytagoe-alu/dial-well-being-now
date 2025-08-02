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
  // Get all active forums
  static async getForums(): Promise<CommunityForum[]> {
    try {
      const { data: forums, error } = await supabase
        .from('community_forums')
        .select('*')
        .eq('is_active', true)
        .order('member_count', { ascending: false });

      if (error) throw error;
      return forums || [];
    } catch (error) {
      console.error('Error getting forums:', error);
      throw error;
    }
  }

  // Get forum posts
  static async getForumPosts(forumId: string, limit: number = 20, offset: number = 0): Promise<ForumPost[]> {
    try {
      const { data: posts, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          user:user_id (
            id,
            email,
            user_metadata
          )
        `)
        .eq('forum_id', forumId)
        .eq('is_approved', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return posts || [];
    } catch (error) {
      console.error('Error getting forum posts:', error);
      throw error;
    }
  }

  // Create a new forum post
  static async createForumPost(
    userId: string,
    forumId: string,
    title: string,
    content: string,
    postType: 'discussion' | 'question' | 'experience' | 'resource' | 'announcement' = 'discussion',
    isAnonymous: boolean = false
  ): Promise<ForumPost> {
    try {
      // Validate inputs
      if (!title.trim()) throw new Error('Title is required');
      if (!content.trim()) throw new Error('Content is required');
      if (title.length > 200) throw new Error('Title too long');

      const { data: post, error } = await supabase
        .from('forum_posts')
        .insert({
          forum_id: forumId,
          user_id: userId,
          title,
          content,
          post_type: postType,
          is_anonymous: isAnonymous
        })
        .select()
        .single();

      if (error) throw error;
      return post;
    } catch (error) {
      console.error('Error creating forum post:', error);
      throw error;
    }
  }

  // Get forum replies
  static async getForumReplies(postId: string): Promise<ForumReply[]> {
    try {
      const { data: replies, error } = await supabase
        .from('forum_replies')
        .select(`
          *,
          user:user_id (
            id,
            email,
            user_metadata
          )
        `)
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return replies || [];
    } catch (error) {
      console.error('Error getting forum replies:', error);
      throw error;
    }
  }

  // Create a forum reply
  static async createForumReply(
    userId: string,
    postId: string,
    content: string,
    isAnonymous: boolean = false
  ): Promise<ForumReply> {
    try {
      // Validate input
      if (!content.trim()) throw new Error('Content is required');

      const { data: reply, error } = await supabase
        .from('forum_replies')
        .insert({
          post_id: postId,
          user_id: userId,
          content,
          is_anonymous: isAnonymous
        })
        .select()
        .single();

      if (error) throw error;

      // Update reply count on the post
      try {
        await supabase.rpc('increment_reply_count', { post_id: postId });
      } catch (rpcError) {
        // Attempt to rollback by deleting the reply
        await supabase
          .from('forum_replies')
          .delete()
          .eq('id', reply.id);
        throw rpcError;
      }

      return reply;
    } catch (error) {
      console.error('Error creating forum reply:', error);
      throw error;
    }
  }

  // Get mentorship programs
  static async getMentorshipPrograms(): Promise<MentorshipProgram[]> {
    try {
      const { data: programs, error } = await supabase
        .from('mentorship_programs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return programs || [];
    } catch (error) {
      console.error('Error getting mentorship programs:', error);
      throw error;
    }
  }

  // Join a mentorship program
  static async joinMentorshipProgram(userId: string, programId: string): Promise<void> {
    try {
      // Check if already enrolled
      const { data: existing } = await supabase
        .from('mentorship_participants')
        .select('id')
        .eq('program_id', programId)
        .eq('user_id', userId)
        .single();
      
      if (existing) throw new Error('Already enrolled in this program');
      
      // Check capacity
      const { data: program } = await supabase
        .from('mentorship_programs')
        .select('max_participants, current_participants')
        .eq('id', programId)
        .single();
      
      if (program && program.current_participants >= program.max_participants) {
        throw new Error('Program is full');
      }
      
      const { error } = await supabase
        .from('mentorship_participants')
        .insert({
          program_id: programId,
          user_id: userId
        });

      if (error) throw error;

      // Update participant count
      await supabase.rpc('increment_participant_count', { program_id: programId });
    } catch (error) {
      console.error('Error joining mentorship program:', error);
      throw error;
    }
  }

  // Get user's coaching sessions
  static async getUserCoachingSessions(userId: string): Promise<CoachingSession[]> {
    try {
      const { data: sessions, error } = await supabase
        .from('coaching_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_date', { ascending: false });

      if (error) throw error;
      return sessions || [];
    } catch (error) {
      console.error('Error getting coaching sessions:', error);
      throw error;
    }
  }

  // Book a coaching session
  static async bookCoachingSession(
    userId: string,
    sessionType: 'nutrition' | 'exercise' | 'mental_health' | 'lifestyle' | 'stress_management',
    sessionDate: string,
    sessionTime: string,
    durationMinutes: number = 60,
    goals?: string
  ): Promise<CoachingSession> {
    try {
      // Validate date is in the future
      const sessionDateTime = new Date(`${sessionDate}T${sessionTime}`);
      if (sessionDateTime <= new Date()) {
        throw new Error('Session must be scheduled in the future');
      }

      // Check for conflicts
      const { data: conflicts } = await supabase
        .from('coaching_sessions')
        .select('id')
        .eq('user_id', userId)
        .eq('session_date', sessionDate)
        .eq('session_time', sessionTime)
        .eq('status', 'scheduled');

      if (conflicts && conflicts.length > 0) {
        throw new Error('Time slot already booked');
      }

      const { data: session, error } = await supabase
        .from('coaching_sessions')
        .insert({
          user_id: userId,
          session_type: sessionType,
          session_date: sessionDate,
          session_time: sessionTime,
          duration_minutes: durationMinutes,
          goals
        })
        .select()
        .single();

      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error booking coaching session:', error);
      throw error;
    }
  }

  // Like a post or reply
  static async likeContent(contentType: 'post' | 'reply', contentId: string): Promise<void> {
    try {
      const table = contentType === 'post' ? 'forum_posts' : 'forum_replies';
      const { error } = await supabase.rpc('increment_likes', { 
        table_name: table, 
        content_id: contentId 
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error liking content:', error);
      throw error;
    }
  }

  // Search forums and posts
  static async searchCommunity(query: string): Promise<{ forums: CommunityForum[], posts: ForumPost[] }> {
    try {
      // Sanitize query to prevent SQL injection
      const sanitizedQuery = query.replace(/[%_]/g, '\\$&');

      // Parallel search
      const [forumsResult, postsResult] = await Promise.all([
        supabase
          .from('community_forums')
          .select('*')
          .or(`name.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
          .eq('is_active', true),
        supabase
          .from('forum_posts')
          .select(`
            *,
            user:user_id (
              id,
              email,
              user_metadata
            )
          `)
          .or(`title.ilike.%${sanitizedQuery}%,content.ilike.%${sanitizedQuery}%`)
          .eq('is_approved', true)
      ]);

      if (forumsResult.error) throw forumsResult.error;
      if (postsResult.error) throw postsResult.error;

      return {
        forums: forumsResult.data || [],
        posts: postsResult.data || []
      };
    } catch (error) {
      console.error('Error searching community:', error);
      throw error;
    }
  }
}