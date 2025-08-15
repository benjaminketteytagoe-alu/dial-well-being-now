import { supabase } from '@/integrations/supabase/client';

export interface TeleconsultationSession {
  doctor: any;
  id: string;
  user_id: string;
  doctor_id: string;
  appointment_id?: string;
  session_type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_start_time?: string;
  actual_end_time?: string;
  session_duration_minutes?: number;
  meeting_url?: string;
  meeting_id?: string;
  session_notes?: string;
  prescription_notes?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DoctorAvailability {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  session_duration_minutes: number;
  max_sessions_per_day: number;
  is_active: boolean;
}

export interface AvailableTimeSlot {
  date: string;
  time: string;
  doctor_id: string;
  doctor_name: string;
  specialty: string;
  session_type: 'video' | 'audio' | 'chat';
}

export class TeleconsultationService {
  // Get available time slots for a specific date range
  static async getAvailableTimeSlots(
    startDate: Date,
    endDate: Date,
    sessionType: 'video' | 'audio' | 'chat' = 'video'
  ): Promise<AvailableTimeSlot[]> {
    try {
      const { data: availability, error: availabilityError } = await supabase
        .from('doctor_teleconsultation_availability')
        .select(`
          *,
          doctors (
            id,
            full_name,
            specialization_id,
            specializations (
              name
            )
          )
        `)
        .eq('is_active', true);

      if (availabilityError) throw availabilityError;

      const availableSlots: AvailableTimeSlot[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        const dateString = currentDate.toISOString().split('T')[0];

        // Get availability for this day
        const dayAvailability = availability?.filter(
          (avail) => avail.day_of_week === dayOfWeek
        );

        for (const avail of dayAvailability || []) {
          const startTime = new Date(`2000-01-01T${avail.start_time}`);
          const endTime = new Date(`2000-01-01T${avail.end_time}`);
          const sessionDuration = avail.session_duration_minutes;

          // Generate time slots
          let currentTime = new Date(startTime);
          while (currentTime < endTime) {
            const timeString = currentTime.toTimeString().slice(0, 5);
            const slotEndTime = new Date(currentTime.getTime() + sessionDuration * 60000);
            
            // Check if slot is available (not already booked)
            const isAvailable = await this.isTimeSlotAvailable(
              avail.doctor_id,
              dateString,
              timeString,
              sessionDuration
            );

            if (isAvailable) {
              availableSlots.push({
                date: dateString,
                time: timeString,
                doctor_id: avail.doctor_id,
                doctor_name: avail.doctors?.full_name || 'Unknown Doctor',
                specialty: avail.doctors?.specializations?.name || 'General',
                session_type: sessionType
              });
            }

            currentTime = slotEndTime;
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return availableSlots;
    } catch (error) {
      console.error('Error getting available time slots:', error);
      throw error;
    }
  }

  // Check if a specific time slot is available
  private static async isTimeSlotAvailable(
    doctorId: string,
    date: string,
    time: string,
    durationMinutes: number
  ): Promise<boolean> {
    try {
      const startDateTime = `${date}T${time}`;
      const endDateTime = new Date(new Date(startDateTime).getTime() + durationMinutes * 60000).toISOString();

      const { data: existingSessions, error } = await supabase
        .from('teleconsultation_sessions')
        .select('id')
        .eq('doctor_id', doctorId)
        .eq('status', 'scheduled')
        .gte('scheduled_start_time', startDateTime)
        .lt('scheduled_start_time', endDateTime);

      if (error) throw error;

      return !existingSessions || existingSessions.length === 0;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  }

  // Book a teleconsultation session
  static async bookSession(
    userId: string,
    doctorId: string,
    sessionType: 'video' | 'audio' | 'chat',
    scheduledStartTime: string,
    sessionDurationMinutes: number = 30,
    notes?: string
  ): Promise<TeleconsultationSession> {
    try {
      const scheduledEndTime = new Date(
        new Date(scheduledStartTime).getTime() + sessionDurationMinutes * 60000
      ).toISOString();

      // Generate meeting URL and ID (in production, integrate with video conferencing service)
      const meetingId = `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const meetingUrl = `https://meet.nauricare.com/${meetingId}`;

      const { data: session, error } = await supabase
        .from('teleconsultation_sessions')
        .insert({
      user_id: userId,
      doctor_id: doctorId || '',
          session_type: sessionType,
          scheduled_start_time: scheduledStartTime,
          scheduled_end_time: scheduledEndTime,
          meeting_url: meetingUrl,
          meeting_id: meetingId,
          session_notes: notes
        })
        .select()
        .single();

      if (error) throw error;

      // Log the booking
      await this.logSessionEvent(session.id, userId, doctorId, 'session_scheduled', {
        session_type: sessionType,
        scheduled_start_time: scheduledStartTime
      });

      return session;
    } catch (error) {
      console.error('Error booking teleconsultation session:', error);
      throw error;
    }
  }

  // Get user's teleconsultation sessions
  static async getUserSessions(userId: string): Promise<TeleconsultationSession[]> {
    try {
      const { data: sessions, error } = await supabase
        .from('teleconsultation_sessions')
        .select(`
          *,
          doctors (
            id,
            full_name,
            specialization_id,
            specializations (
              name
            )
          )
        `)
        .eq('user_id', userId)
        .order('scheduled_start_time', { ascending: false });

      if (error) throw error;

      return sessions || [];
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw error;
    }
  }

  // Start a teleconsultation session
  static async startSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('teleconsultation_sessions')
        .update({
          status: 'in-progress',
          actual_start_time: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Log the session start
      const session = await this.getSessionById(sessionId);
      if (session) {
        await this.logSessionEvent(sessionId, session.user_id, session.doctor_id, 'session_started');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }

  // End a teleconsultation session
  static async endSession(
    sessionId: string,
    prescriptionNotes?: string,
    followUpRequired: boolean = false,
    followUpDate?: string
  ): Promise<void> {
    try {
      const session = await this.getSessionById(sessionId);
      if (!session) throw new Error('Session not found');

      const actualEndTime = new Date().toISOString();
      const sessionDuration = Math.round(
        (new Date(actualEndTime).getTime() - new Date(session.actual_start_time || session.scheduled_start_time).getTime()) / 60000
      );

      const { error } = await supabase
        .from('teleconsultation_sessions')
        .update({
          status: 'completed',
          actual_end_time: actualEndTime,
          session_duration_minutes: sessionDuration,
          prescription_notes: prescriptionNotes,
          follow_up_required: followUpRequired,
          follow_up_date: followUpDate
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Log the session end
      await this.logSessionEvent(sessionId, session.user_id, session.doctor_id, 'session_ended', {
        session_duration_minutes: sessionDuration,
        prescription_notes: prescriptionNotes
      });
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }

  // Cancel a teleconsultation session
  static async cancelSession(sessionId: string, reason?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('teleconsultation_sessions')
        .update({
          status: 'cancelled'
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Log the cancellation
      const session = await this.getSessionById(sessionId);
      if (session) {
        await this.logSessionEvent(sessionId, session.user_id, session.doctor_id, 'session_cancelled', {
          reason
        });
      }
    } catch (error) {
      console.error('Error cancelling session:', error);
      throw error;
    }
  }

  // Get session by ID
  static async getSessionById(sessionId: string): Promise<TeleconsultationSession | null> {
    try {
      const { data: session, error } = await supabase
        .from('teleconsultation_sessions')
        .select(`
          *,
          doctors (
            id,
            full_name,
            specialization_id,
            specializations (
              name
            )
          )
        `)
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      return session;
    } catch (error) {
      console.error('Error getting session by ID:', error);
      return null;
    }
  }

  // Log session events (for audit purposes)
  private static async logSessionEvent(
    sessionId: string,
    userId: string,
    doctorId: string,
    eventType: string,
    eventDetails?: any
  ): Promise<void> {
    try {
      await supabase
        .from('teleconsultation_logs')
        .insert({
          session_id: sessionId,
          user_id: userId,
          doctor_id: doctorId || '',
          event_type: eventType,
          event_details: eventDetails
        });
    } catch (error) {
      console.error('Error logging session event:', error);
    }
  }
} 