import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { useWebsite } from '@/contexts/WebsiteContext';
import { Image } from 'expo-image';
import { Search, Calendar, MapPin, Clock, ArrowLeft, Check, X, Users, CheckCircle2 } from 'lucide-react-native';
import type { Event, RSVP } from '@/lib/supabase';

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { websiteData, updateAttendance, refetchEvents } = useWebsite();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isCheckInMode, setIsCheckInMode] = useState(false);

  const event = websiteData.events.find(e => e.id === id);
  const rsvps = event?.rsvps || [];

  const filteredRsvps = rsvps.filter((rsvp) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return rsvp.name?.toLowerCase().includes(query) || false;
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchEvents();
    setRefreshing(false);
  }, [refetchEvents]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAttendance = async (rsvpId: string, currentAttendance: 'attended' | 'not_attended' | null) => {
    try {
      // Toggle: if already attended, set to not_attended, otherwise set to attended
      const newAttendance = currentAttendance === 'attended' ? 'not_attended' : 'attended';
      console.log('Handling attendance update:', { rsvpId, currentAttendance, newAttendance });
      await updateAttendance(rsvpId, newAttendance);
      console.log('Attendance updated successfully in UI');
    } catch (error) {
      console.error('Error updating attendance:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update attendance. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const attendedCount = rsvps.filter(r => r.attendance === 'attended').length;
  const notAttendedCount = rsvps.filter(r => r.attendance === 'not_attended').length;
  const pendingCount = rsvps.filter(r => !r.attendance).length;

  if (!event) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.light.text} />
          </TouchableOpacity>
          <Text variant="h1">Event Not Found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text variant="h1">Event Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Event Image */}
        {event.image_url && (
          <Image 
            source={{ uri: event.image_url }} 
            style={styles.eventImage}
            contentFit="cover"
          />
        )}

        {/* Event Details */}
        <Card style={styles.detailsCard} padding="l">
          <Text variant="h2" style={styles.eventTitle}>
            {event.title}
          </Text>
          
          {event.description && (
            <Text variant="body" color={COLORS.light.textSecondary} style={styles.description}>
              {event.description}
            </Text>
          )}

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Calendar size={20} color={COLORS.primary} />
              <Text variant="body" style={styles.detailText}>
                {formatDate(event.event_date)}
              </Text>
            </View>
            
            {event.event_time && (
              <View style={styles.detailRow}>
                <Clock size={20} color={COLORS.primary} />
                <Text variant="body" style={styles.detailText}>
                  {formatTime(event.event_time)}
                </Text>
              </View>
            )}
            
            {event.location_name && (
              <View style={styles.detailRow}>
                <MapPin size={20} color={COLORS.primary} />
                <Text variant="body" style={styles.detailText}>
                  {event.location_name}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* RSVPs Section */}
        <Card style={styles.rsvpsCard} padding="l">
          <View style={styles.rsvpsHeader}>
            <View style={styles.rsvpsHeaderLeft}>
              <Users size={24} color={COLORS.primary} />
              <View>
                <Text variant="h3">RSVPs</Text>
                <Text variant="caption" color={COLORS.light.textSecondary}>
                  {rsvps.length} {rsvps.length === 1 ? 'person' : 'people'} RSVP'd
                </Text>
              </View>
            </View>
            {!isCheckInMode && (
              <TouchableOpacity
                onPress={() => setIsCheckInMode(true)}
                style={styles.checkInButton}
                activeOpacity={0.7}
              >
                <CheckCircle2 size={18} color="#FFFFFF" />
                <Text variant="bodyBold" color="#FFFFFF" style={styles.checkInButtonText}>
                  Start Check-in
                </Text>
              </TouchableOpacity>
            )}
            {isCheckInMode && (
              <TouchableOpacity
                onPress={() => setIsCheckInMode(false)}
                style={styles.cancelCheckInButton}
                activeOpacity={0.7}
              >
                <Text variant="bodyBold" color={COLORS.light.text}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Attendance Stats */}
          {isCheckInMode && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="captionBold" color={COLORS.success}>
                  {attendedCount} Attended
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="captionBold" color={COLORS.error}>
                  {notAttendedCount} Not Attended
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="captionBold" color={COLORS.light.textSecondary}>
                  {pendingCount} Pending
                </Text>
              </View>
            </View>
          )}

          {/* Search */}
          {isCheckInMode && (
            <View style={styles.searchContainer}>
              <Input
                placeholder="Search RSVPs..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                icon={<Search size={20} color={COLORS.light.textSecondary} />}
                style={styles.searchInput}
              />
            </View>
          )}

          {/* RSVPs List */}
          {rsvps.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={48} color={COLORS.light.textSecondary} />
              <Text variant="h3" align="center" style={styles.emptyTitle}>
                No RSVPs yet
              </Text>
              <Text variant="body" align="center" color={COLORS.light.textSecondary}>
                RSVPs will appear here once people sign up
              </Text>
            </View>
          ) : (
            <View style={styles.rsvpsList}>
              {filteredRsvps.map((rsvp) => (
                <RSVPCard
                  key={rsvp.id}
                  rsvp={rsvp}
                  isCheckInMode={isCheckInMode}
                  onAttendanceChange={handleAttendance}
                  getInitials={getInitials}
                />
              ))}
            </View>
          )}
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
}

const RSVPCard = ({
  rsvp,
  isCheckInMode,
  onAttendanceChange,
  getInitials,
}: {
  rsvp: RSVP;
  isCheckInMode: boolean;
  onAttendanceChange: (rsvpId: string, currentAttendance: 'attended' | 'not_attended' | null) => void;
  getInitials: (name: string | null) => string;
}) => {
  const isAttended = rsvp.attendance === 'attended';
  const isNotAttended = rsvp.attendance === 'not_attended';

  return (
    <View style={styles.rsvpCard}>
      <View style={styles.rsvpContent}>
        <View style={styles.rsvpLeft}>
          {rsvp.avatar_url ? (
            <Image 
              source={{ uri: rsvp.avatar_url }} 
              style={styles.rsvpAvatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.rsvpAvatar, styles.avatarPlaceholder]}>
              <Text variant="bodyBold" color={COLORS.primary}>
                {getInitials(rsvp.name)}
              </Text>
            </View>
          )}
          <View style={styles.rsvpInfo}>
            <Text variant="bodyBold" style={styles.rsvpName}>
              {rsvp.name || 'Unnamed'}
            </Text>
            {isCheckInMode && rsvp.attendance && (
              <View style={[
                styles.attendanceBadge,
                { backgroundColor: isAttended ? COLORS.success + '20' : COLORS.error + '20' }
              ]}>
                <Text 
                  variant="captionBold" 
                  style={{ color: isAttended ? COLORS.success : COLORS.error }}
                >
                  {isAttended ? 'Attended' : 'Not Attended'}
                </Text>
              </View>
            )}
          </View>
        </View>
        {isCheckInMode && (
          <View style={styles.attendanceButtons}>
            <TouchableOpacity
              onPress={() => onAttendanceChange(rsvp.id, rsvp.attendance)}
              style={[
                styles.attendanceButton,
                styles.checkButton,
                isAttended && styles.attendanceButtonActive
              ]}
              activeOpacity={0.7}
            >
              <Check 
                size={20} 
                color={isAttended ? "#FFFFFF" : COLORS.success} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAttendanceChange(rsvp.id, rsvp.attendance)}
              style={[
                styles.attendanceButton,
                styles.xButton,
                isNotAttended && styles.attendanceButtonActiveX
              ]}
              activeOpacity={0.7}
            >
              <X 
                size={20} 
                color={isNotAttended ? "#FFFFFF" : COLORS.error} 
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  backButton: {
    padding: SPACING.xs,
  },
  content: {
    paddingBottom: 100,
  },
  eventImage: {
    width: '100%',
    height: 250,
    marginBottom: SPACING.m,
  },
  detailsCard: {
    marginHorizontal: SPACING.l,
    marginBottom: SPACING.l,
    borderRadius: RADIUS.l,
  },
  eventTitle: {
    marginBottom: SPACING.m,
  },
  description: {
    marginBottom: SPACING.l,
    lineHeight: 22,
  },
  detailsContainer: {
    gap: SPACING.m,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  detailText: {
    flex: 1,
  },
  rsvpsCard: {
    marginHorizontal: SPACING.l,
    marginBottom: SPACING.l,
    borderRadius: RADIUS.l,
  },
  rsvpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  rsvpsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    flex: 1,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.m,
  },
  checkInButtonText: {
    marginLeft: 0,
  },
  cancelCheckInButton: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.m,
    paddingVertical: SPACING.m,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.light.border,
  },
  statItem: {
    flex: 1,
  },
  searchContainer: {
    marginBottom: SPACING.m,
  },
  searchInput: {
    marginBottom: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.m,
  },
  emptyTitle: {
    marginTop: SPACING.m,
  },
  rsvpsList: {
    gap: SPACING.m,
  },
  rsvpCard: {
    padding: SPACING.m,
    backgroundColor: COLORS.light.surface,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  rsvpContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rsvpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.m,
  },
  rsvpAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.light.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  rsvpInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  rsvpName: {
    marginBottom: 0,
  },
  attendanceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: RADIUS.s,
  },
  attendanceButtons: {
    flexDirection: 'row',
    gap: SPACING.s,
  },
  attendanceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  checkButton: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '10',
  },
  xButton: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error + '10',
  },
  attendanceButtonActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  attendanceButtonActiveX: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
});

