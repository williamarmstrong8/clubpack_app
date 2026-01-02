import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Event, Membership, RSVP } from '@/lib/supabase';

interface MemberStats {
  total: number;
  newThisMonth: number;
  organizers: number;
}

interface EventStats {
  upcomingEvents: number;
  totalRSVPs: number;
  attendanceRate: string;
  eventsThisMonth: number;
}

interface EventWithRSVPs extends Event {
  rsvps?: RSVP[];
}

interface WebsiteData {
  clubId: string | null;
  clubName: string;
  members: Membership[];
  memberStats: MemberStats;
  membersLoading: boolean;
  membersError: string | null;
  events: EventWithRSVPs[];
  eventStats: EventStats;
  eventsLoading: boolean;
  eventsError: string | null;
}

interface WebsiteContextType {
  websiteData: WebsiteData;
  isLoading: boolean;
  error: string | null;
  fetchMembers: (clubId: string) => Promise<void>;
  fetchEvents: (clubId: string) => Promise<void>;
  refetchMembers: () => Promise<void>;
  refetchEvents: () => Promise<void>;
  updateAttendance: (rsvpId: string, attendance: 'attended' | 'not_attended' | null) => Promise<void>;
}

const defaultWebsiteData: WebsiteData = {
  clubId: null,
  clubName: '',
  members: [],
  memberStats: {
    total: 0,
    newThisMonth: 0,
    organizers: 0,
  },
  membersLoading: false,
  membersError: null,
  events: [],
  eventStats: {
    upcomingEvents: 0,
    totalRSVPs: 0,
    attendanceRate: '0%',
    eventsThisMonth: 0,
  },
  eventsLoading: false,
  eventsError: null,
};

const WebsiteContext = createContext<WebsiteContextType | null>(null);

export const WebsiteProvider = ({ children }: { children: React.ReactNode }) => {
  const [websiteData, setWebsiteData] = useState<WebsiteData>(defaultWebsiteData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setMembersLoading = () => {
    setWebsiteData(prev => ({ ...prev, membersLoading: true, membersError: null }));
  };

  const setMembersSuccess = (members: Membership[], stats: MemberStats) => {
    setWebsiteData(prev => ({
      ...prev,
      members,
      memberStats: stats,
      membersLoading: false,
      membersError: null,
    }));
  };

  const setMembersError = (error: string) => {
    setWebsiteData(prev => ({
      ...prev,
      members: [],
      memberStats: defaultWebsiteData.memberStats,
      membersLoading: false,
      membersError: error,
    }));
  };

  const setEventsLoading = () => {
    setWebsiteData(prev => ({ ...prev, eventsLoading: true, eventsError: null }));
  };

  const setEventsSuccess = (events: EventWithRSVPs[], stats: EventStats) => {
    setWebsiteData(prev => ({
      ...prev,
      events,
      eventStats: stats,
      eventsLoading: false,
      eventsError: null,
    }));
  };

  const setEventsError = (error: string) => {
    setWebsiteData(prev => ({
      ...prev,
      events: [],
      eventStats: defaultWebsiteData.eventStats,
      eventsLoading: false,
      eventsError: error,
    }));
  };

  const fetchMembers = async (clubId: string) => {
    try {
      setMembersLoading();
      console.log('Fetching members for club:', clubId);

      const { data: memberships, error: membersError } = await supabase
        .from('memberships')
        .select('*')
        .eq('club_id', clubId)
        .order('joined_at', { ascending: false });

      if (membersError) {
        console.error('Error fetching memberships:', membersError);
        throw membersError;
      }

      console.log('Fetched memberships:', memberships);

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const memberStats: MemberStats = {
        total: memberships?.length || 0,
        newThisMonth: memberships?.filter(m => m.joined_at && new Date(m.joined_at) >= firstDayOfMonth).length || 0,
        organizers: memberships?.filter(m => m.role?.toLowerCase() === 'organizer').length || 0,
      };

      console.log('Calculated member stats:', memberStats);

      setMembersSuccess(memberships || [], memberStats);
    } catch (error) {
      console.error('Error in fetchMembers:', error);
      setMembersError(error instanceof Error ? error.message : 'Failed to fetch members');
    }
  };

  const fetchEvents = async (clubId: string) => {
    try {
      setEventsLoading();
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('club_id', clubId)
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Fetch all RSVPs for the club once, then group by event_id
      const { data: rawRsvps, error: rsvpsError } = await supabase
        .from('rsvps')
        .select(`
          id,
          event_id,
          membership_id,
          avatar_url,
          created_at,
          name,
          email,
          attendance,
          memberships (
            name
          )
        `)
        .eq('club_id', clubId)
        .order('created_at', { ascending: true });

      if (rsvpsError) throw rsvpsError;

      const rsvpsByEventId: Record<string, RSVP[]> = {};
      (rawRsvps || []).forEach((rsvp: any) => {
        const eventId = rsvp.event_id as string;
        const transformed: RSVP = {
          id: rsvp.id,
          membership_id: rsvp.membership_id,
          avatar_url: rsvp.avatar_url,
          created_at: rsvp.created_at,
          // Use name from RSVP record first, fallback to membership name
          name: rsvp.name || rsvp.memberships?.name || null,
          email: rsvp.email,
          attendance: rsvp.attendance || null,
        };
        if (!rsvpsByEventId[eventId]) rsvpsByEventId[eventId] = [];
        rsvpsByEventId[eventId].push(transformed);
      });

      const eventsWithRSVPs = (events || []).map(event => ({
        ...event,
        rsvps: rsvpsByEventId[event.id] || [],
      }));

      // Calculate event stats
      const now = new Date();
      const upcomingEvents = eventsWithRSVPs.filter(event => new Date(event.event_date) >= now).length;
      const totalRSVPs = eventsWithRSVPs.reduce((sum, event) => sum + (event.rsvps?.length || 0), 0);
      const attendanceRate = '0%'; // Hardcoded to 0%
      const totalEvents = eventsWithRSVPs.length;

      setEventsSuccess(eventsWithRSVPs, {
        upcomingEvents,
        totalRSVPs,
        attendanceRate,
        eventsThisMonth: totalEvents,
      });
    } catch (err) {
      console.error('Error fetching events:', err);
      setEventsError(err instanceof Error ? err.message : 'Failed to fetch events');
    }
  };

  const fetchWebsiteData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First check session without throwing errors
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // If there's no session or an error, don't fetch
      if (sessionError || !session?.user) {
        setIsLoading(false);
        setWebsiteData(defaultWebsiteData);
        return;
      }

      const user = session.user;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const { data: club, error: clubError } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', profile.club_id)
        .single();

      if (clubError) throw clubError;

      // Update website data with club info
      setWebsiteData(prev => ({
        ...prev,
        clubId: club.id,
        clubName: club.name || '',
      }));

      // Fetch members and events in parallel
      await Promise.all([
        fetchMembers(club.id),
        fetchEvents(club.id),
      ]);
    } catch (err) {
      console.error('Error fetching website data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load website data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when user is authenticated
  // Listen for auth state changes
  useEffect(() => {
    let isMounted = true;
    let hasFetched = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && session?.user && !hasFetched) {
        // User signed in, fetch data
        hasFetched = true;
        await fetchWebsiteData();
      } else if (event === 'SIGNED_OUT') {
        // User signed out, reset data
        hasFetched = false;
        setWebsiteData(defaultWebsiteData);
        setIsLoading(false);
        setError(null);
      } else if (event === 'INITIAL_SESSION' && session?.user && !hasFetched) {
        // Initial load with existing session
        hasFetched = true;
        await fetchWebsiteData();
      } else if (!session?.user) {
        // No session, reset data
        hasFetched = false;
        setWebsiteData(defaultWebsiteData);
        setIsLoading(false);
        setError(null);
      }
    });

    // Check initial session (only once)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      if (session?.user && !hasFetched) {
        hasFetched = true;
        fetchWebsiteData();
      } else if (!session?.user) {
        setWebsiteData(defaultWebsiteData);
        setIsLoading(false);
        setError(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refetchMembers = async () => {
    if (websiteData.clubId) {
      await fetchMembers(websiteData.clubId);
    }
  };

  const refetchEvents = async () => {
    if (websiteData.clubId) {
      await fetchEvents(websiteData.clubId);
    }
  };

  const updateAttendance = async (rsvpId: string, attendance: 'attended' | 'not_attended' | null) => {
    try {
      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Verify user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, club_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Failed to verify permissions');
      }

      if (profile?.role !== 'admin') {
        console.error('User does not have admin role. Current role:', profile?.role);
        throw new Error('Only admins can update attendance');
      }

      console.log('Updating attendance:', { rsvpId, attendance, userId: user.id, clubId: profile.club_id });

      const { data, error } = await supabase
        .from('rsvps')
        .update({ attendance })
        .eq('id', rsvpId)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Attendance updated successfully:', data);

      // Update local state
      setWebsiteData(prev => ({
        ...prev,
        events: prev.events.map(event => ({
          ...event,
          rsvps: event.rsvps?.map(rsvp => 
            rsvp.id === rsvpId ? { ...rsvp, attendance } : rsvp
          ) || [],
        })),
      }));
    } catch (err) {
      console.error('Error updating attendance:', err);
      throw err;
    }
  };

  const contextValue: WebsiteContextType = {
    websiteData,
    isLoading,
    error,
    fetchMembers,
    fetchEvents,
    refetchMembers,
    refetchEvents,
    updateAttendance,
  };

  return <WebsiteContext.Provider value={contextValue}>{children}</WebsiteContext.Provider>;
};

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
};

