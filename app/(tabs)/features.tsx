import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, RefreshControl, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { useWebsite } from '@/contexts/WebsiteContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Event } from '@/lib/supabase';
import { Search, Calendar, MapPin, Clock, Plus, Trash2, X, Image as ImageIcon, ChevronDown } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
// @ts-ignore - Package may need to be installed: npm install @react-native-community/datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EventsScreen() {
  const router = useRouter();
  const { websiteData, refetchEvents } = useWebsite();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location_name: '',
  });
  const [error, setError] = useState('');
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  const events = websiteData.events || [];
  const stats = websiteData.eventStats;

  // Filter to only show future and present day events
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of today
  
  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.event_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= now;
  });

  const filteredEvents = futureEvents.filter((event) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      event.title?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.location_name?.toLowerCase().includes(query)
    );
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
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // If time is in HH:MM format, convert to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    const now = new Date();
    setSelectedDate(now);
    setSelectedTime(now);
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      location_name: '',
    });
    setEventImage(null);
    setError('');
    setIsModalOpen(true);
  };

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const parseDateFromInput = (dateString: string): string => {
    if (!dateString) return '';
    // Try to parse "day month year" format (e.g., "15 Jan 2024")
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If parsing fails, return original string (might be YYYY-MM-DD)
      return dateString;
    }
    // Convert to YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    // Parse date and time for pickers
    const eventDate = event.event_date ? new Date(event.event_date) : new Date();
    const [hours, minutes] = event.event_time ? event.event_time.split(':').slice(0, 2).map(Number) : [new Date().getHours(), new Date().getMinutes()];
    const timeDate = new Date();
    timeDate.setHours(hours, minutes, 0, 0);
    
    setSelectedDate(eventDate);
    setSelectedTime(timeDate);
    
    // Format date for display
    const date = event.event_date ? formatDateForInput(event.event_date) : '';
    const time = event.event_time ? event.event_time.split(':').slice(0, 2).join(':') : '';
    setFormData({
      title: event.title || '',
      description: event.description || '',
      event_date: date,
      event_time: time,
      location_name: event.location_name || '',
    });
    setEventImage(event.image_url || null);
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      location_name: '',
    });
    setEventImage(null);
    setError('');
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'dismissed') {
        return;
      }
    }
    if (date) {
      setSelectedDate(date);
      const formattedDate = formatDateForInput(date.toISOString());
      setFormData({ ...formData, event_date: formattedDate });
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (event.type === 'dismissed') {
        return;
      }
    }
    if (time) {
      setSelectedTime(time);
      // Store in 24-hour format for database (HH:MM)
      const hours24 = time.getHours();
      const minutes = String(time.getMinutes()).padStart(2, '0');
      const hours24Str = String(hours24).padStart(2, '0');
      setFormData({ ...formData, event_time: `${hours24Str}:${minutes}` });
      if (Platform.OS === 'android') {
        setShowTimePicker(false);
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEventImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string, eventId: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `${eventId}-${Date.now()}.jpg`;
      const filePath = `${websiteData.clubId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('club-events')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('club-events')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.event_date || !formData.event_time || !formData.location_name.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!websiteData.clubId || !user) {
      setError('Missing club or user information');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Parse date from input format (could be "day month year" or "YYYY-MM-DD")
      const parsedDate = editingEvent ? parseDateFromInput(formData.event_date) : formData.event_date;
      // Combine date and time
      const dateTimeString = `${parsedDate}T${formData.event_time}`;

      if (editingEvent) {
        // Update existing event
        let imageUrl = editingEvent.image_url || null;
        
        // If new image was selected, upload it
        if (eventImage && !eventImage.startsWith('http')) {
          imageUrl = await uploadImage(eventImage, editingEvent.id);
        } else if (eventImage && eventImage.startsWith('http')) {
          // Keep existing image
          imageUrl = eventImage;
        } else if (!eventImage && editingEvent.image_url) {
          // Image was removed
          imageUrl = null;
        }

        const { error: updateError } = await (supabase
          .from('events') as any)
          .update({
            title: formData.title.trim(),
            description: formData.description.trim(),
            event_date: dateTimeString,
            event_time: formData.event_time,
            location_name: formData.location_name.trim(),
            status: editingEvent.status || 'upcoming',
            image_url: imageUrl,
          })
          .eq('id', editingEvent.id);

        if (updateError) throw updateError;
      } else {
        // Create new event first (without image)
        const insertResult = await (supabase
          .from('events') as any)
          .insert([
            {
              club_id: websiteData.clubId,
              title: formData.title.trim(),
              description: formData.description.trim(),
              event_date: dateTimeString,
              event_time: formData.event_time,
              location_name: formData.location_name.trim(),
              status: 'upcoming',
              created_by: user.id,
            },
          ])
          .select()
          .single();
        const newEvent = insertResult.data as Event | null;
        const insertError = insertResult.error;

        if (insertError) throw insertError;

        // If image was selected, upload it and update the event
        if (eventImage && !eventImage.startsWith('http') && newEvent) {
          const imageUrl = await uploadImage(eventImage, newEvent.id);
          await (supabase
            .from('events') as any)
            .update({ image_url: imageUrl })
            .eq('id', newEvent.id);
        }
      }

      await refetchEvents();
      closeModal();
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (event: Event) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', event.id);

              if (error) throw error;

              await refetchEvents();
            } catch (err) {
              console.error('Error deleting event:', err);
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View>
          <Text variant="h1">Events</Text>
        <Text variant="body" color={COLORS.light.textSecondary}>
            {stats.upcomingEvents} upcoming events
        </Text>
        </View>
        <TouchableOpacity
          onPress={openCreateModal}
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input 
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Search size={20} color={COLORS.light.textSecondary} />}
          style={styles.searchInput}
        />
      </View>

      {/* Events List */}
      {websiteData.eventsLoading && events.length === 0 ? (
        <View style={styles.loadingContainer}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '60%' }]} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        >
          {filteredEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar size={48} color={COLORS.light.textSecondary} />
              <Text variant="h3" align="center" style={styles.emptyTitle}>
                {searchQuery ? 'No events found' : 'No events yet'}
              </Text>
              <Text variant="body" align="center" color={COLORS.light.textSecondary}>
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Create your first event to get started'
                }
              </Text>
            </View>
          ) : (
            filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onPress={() => router.push({ pathname: '/event-detail', params: { id: event.id } })}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* Create/Edit Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <ScreenWrapper>
            <View style={styles.modalHeader}>
              <Text variant="h1">
                {editingEvent ? 'Edit Event' : 'Create Event'}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={24} color={COLORS.light.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {error ? (
                <View style={styles.errorContainer}>
                  <Text variant="caption" color={COLORS.error} style={styles.errorText}>
                    {error}
                  </Text>
                </View>
              ) : null}

              <View style={styles.imageUploadContainer}>
                <Text variant="bodyBold" style={styles.label}>Event Image</Text>
                {eventImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: eventImage }} 
                      style={styles.imagePreview}
                      contentFit="cover"
                    />
                    <TouchableOpacity 
                      onPress={() => setEventImage(null)}
                      style={styles.removeImageButton}
                    >
                      <X size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    onPress={pickImage}
                    style={styles.imageUploadButton}
                    activeOpacity={0.7}
                  >
                    <ImageIcon size={24} color={COLORS.primary} />
                    <Text variant="body" color={COLORS.primary} style={styles.imageUploadText}>
                      Choose Image
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Input
                label="Event Title *"
                placeholder="Enter event title"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                style={[styles.input, styles.centeredInput]}
              />

              <View style={styles.textAreaContainer}>
                <Text variant="bodyBold" style={styles.label}>Description</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter event description"
                  placeholderTextColor={COLORS.light.textSecondary}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text variant="captionBold" color={COLORS.light.textSecondary} style={styles.pickerLabel}>
                    DATE *
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (showDatePicker) {
                        setShowDatePicker(false);
                      } else {
                        setShowTimePicker(false);
                        setShowDatePicker(true);
                      }
                    }}
                    style={styles.pickerButton}
                    activeOpacity={0.7}
                  >
                    <Text variant="body" style={[styles.pickerButtonText, !formData.event_date && styles.pickerPlaceholder]}>
                      {formData.event_date || 'Select date'}
                    </Text>
                    <ChevronDown size={18} color={COLORS.light.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.halfWidth}>
                  <Text variant="captionBold" color={COLORS.light.textSecondary} style={styles.pickerLabel}>
                    TIME *
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (showTimePicker) {
                        setShowTimePicker(false);
                      } else {
                        setShowDatePicker(false);
                        setShowTimePicker(true);
                      }
                    }}
                    style={styles.pickerButton}
                    activeOpacity={0.7}
                  >
                    <Text variant="body" style={[styles.pickerButtonText, !formData.event_time && styles.pickerPlaceholder]}>
                      {formData.event_time ? formatTime(formData.event_time) : 'Select time'}
                    </Text>
                    <ChevronDown size={18} color={COLORS.light.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Picker Modal */}
              {showDatePicker && (
                <Modal
                  visible={showDatePicker}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowDatePicker(false)}
                >
                  <View style={styles.pickerModalBackdrop}>
                    <TouchableOpacity
                      style={StyleSheet.absoluteFill}
                      activeOpacity={1}
                      onPress={() => setShowDatePicker(false)}
                    />
                    <View style={styles.pickerModalContent} onStartShouldSetResponder={() => true}>
                      <View style={styles.pickerModalHeader}>
                        <Text variant="h3">Select Date</Text>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}
                          style={styles.pickerCloseButton}
                        >
                          <X size={24} color={COLORS.light.text} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.pickerContainer}>
                        <DateTimePicker
                          value={selectedDate}
                          mode="date"
                          display="spinner"
                          onChange={onDateChange}
                          minimumDate={new Date()}
                          style={styles.dateTimePicker}
                          textColor={COLORS.light.text}
                          accentColor={COLORS.primary}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        style={styles.pickerDoneButton}
                      >
                        <Text variant="bodyBold" color="#FFFFFF">Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}

              {/* Time Picker Modal */}
              {showTimePicker && (
                <Modal
                  visible={showTimePicker}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowTimePicker(false)}
                >
                  <View style={styles.pickerModalBackdrop}>
                    <TouchableOpacity
                      style={StyleSheet.absoluteFill}
                      activeOpacity={1}
                      onPress={() => setShowTimePicker(false)}
                    />
                    <View style={styles.pickerModalContent} onStartShouldSetResponder={() => true}>
                      <View style={styles.pickerModalHeader}>
                        <Text variant="h3">Select Time</Text>
                        <TouchableOpacity
                          onPress={() => setShowTimePicker(false)}
                          style={styles.pickerCloseButton}
                        >
                          <X size={24} color={COLORS.light.text} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.pickerContainer}>
                        <DateTimePicker
                          value={selectedTime}
                          mode="time"
                          display="spinner"
                          onChange={onTimeChange}
                          is24Hour={false}
                          style={styles.dateTimePicker}
                          textColor={COLORS.light.text}
                          accentColor={COLORS.primary}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => setShowTimePicker(false)}
                        style={styles.pickerDoneButton}
                      >
                        <Text variant="bodyBold" color="#FFFFFF">Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}

              <Input
                label="Location *"
                placeholder="Enter location"
                value={formData.location_name}
                onChangeText={(text) => setFormData({ ...formData, location_name: text })}
                style={[styles.input, styles.centeredInput]}
              />

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                activeOpacity={0.8}
              >
                <Text variant="bodyBold" color="#FFFFFF">
                  {isSubmitting 
                    ? (editingEvent ? 'Updating...' : 'Creating...')
                    : (editingEvent ? 'Update Event' : 'Create Event')
                  }
                </Text>
              </TouchableOpacity>

              {editingEvent && (
                <TouchableOpacity
                  onPress={() => handleDelete(editingEvent)}
                  style={styles.deleteButton}
                  activeOpacity={0.8}
                >
                  <Trash2 size={18} color={COLORS.error} />
                  <Text variant="bodyBold" color={COLORS.error} style={styles.deleteButtonText}>
                    Delete Event
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </ScreenWrapper>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenWrapper>
  );
}

const EventCard = ({ 
  event, 
  onPress,
  formatDate,
  formatTime
}: { 
  event: Event, 
  onPress: () => void,
  formatDate: (date: string) => string,
  formatTime: (time: string) => string
}) => {
  const isPast = new Date(event.event_date) < new Date();
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Card style={styles.eventCard} padding="l">
      {event.image_url && (
        <Image 
          source={{ uri: event.image_url }} 
          style={styles.eventImage}
          contentFit="cover"
        />
      )}
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={styles.eventHeaderLeft}>
            <Text variant="h3" style={styles.eventTitle}>
              {event.title}
            </Text>
            {event.status && (
              <View style={[
                styles.statusBadge,
                { backgroundColor: isPast ? COLORS.light.textSecondary + '20' : COLORS.primary + '20' }
              ]}>
                <Text 
                  variant="captionBold" 
                  style={{ color: isPast ? COLORS.light.textSecondary : COLORS.primary }}
                >
                  {event.status}
                </Text>
              </View>
            )}
          </View>
        </View>

        {event.description ? (
          <Text variant="body" color={COLORS.light.textSecondary} numberOfLines={2} style={styles.eventDescription}>
            {event.description}
          </Text>
        ) : null}

        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Calendar size={16} color={COLORS.light.textSecondary} />
            <Text variant="caption" color={COLORS.light.textSecondary}>
              {formatDate(event.event_date)}
            </Text>
          </View>
          {event.event_time && (
            <View style={styles.eventDetail}>
              <Clock size={16} color={COLORS.light.textSecondary} />
              <Text variant="caption" color={COLORS.light.textSecondary}>
                {formatTime(event.event_time)}
              </Text>
            </View>
          )}
          {event.location_name && (
            <View style={styles.eventDetail}>
              <MapPin size={16} color={COLORS.light.textSecondary} />
              <Text variant="caption" color={COLORS.light.textSecondary} numberOfLines={1}>
                {event.location_name}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  searchInput: {
    marginBottom: 0,
  },
  content: {
    paddingHorizontal: SPACING.l,
    paddingBottom: 100,
    gap: SPACING.m,
  },
  loadingContainer: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
  },
  skeletonCard: {
    flexDirection: 'row',
    gap: SPACING.m,
    padding: SPACING.l,
    backgroundColor: COLORS.light.surface,
    borderRadius: RADIUS.l,
  },
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.light.surfaceHighlight,
  },
  skeletonContent: {
    flex: 1,
    gap: SPACING.xs,
  },
  skeletonLine: {
    height: 16,
    width: '80%',
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.light.surfaceHighlight,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
    gap: SPACING.m,
  },
  emptyTitle: {
    marginTop: SPACING.m,
  },
  eventCard: {
    borderRadius: RADIUS.l,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 200,
    marginBottom: SPACING.m,
    borderRadius: RADIUS.m,
  },
  eventContent: {
    gap: SPACING.s,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.s,
  },
  eventHeaderLeft: {
    flex: 1,
    gap: SPACING.xs,
  },
  eventTitle: {
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: RADIUS.s,
  },
  eventDescription: {
    marginTop: SPACING.xs,
  },
  eventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.m,
    marginTop: SPACING.xs,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flex: 1,
    minWidth: 120,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  modalContent: {
    padding: SPACING.l,
    paddingBottom: 100,
  },
  errorContainer: {
    marginBottom: SPACING.m,
    padding: SPACING.s,
    backgroundColor: COLORS.error + '10',
    borderRadius: RADIUS.s,
  },
  errorText: {
    textAlign: 'center',
  },
  input: {
    marginBottom: SPACING.m,
  },
  centeredInput: {
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingVertical: 0,
  },
  pickerLabel: {
    marginBottom: SPACING.xs,
    fontSize: 10,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.light.surface,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.m,
    height: 48,
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  pickerButtonText: {
    flex: 1,
    color: COLORS.light.text,
    fontSize: 16,
  },
  pickerPlaceholder: {
    color: COLORS.light.textSecondary,
  },
  pickerModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: COLORS.light.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingBottom: SPACING.l,
    maxHeight: 320,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  pickerCloseButton: {
    padding: SPACING.xs,
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginHorizontal: SPACING.l,
    borderRadius: RADIUS.m,
  },
  dateTimePicker: {
    height: 180,
    width: '100%',
  },
  pickerDoneButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.l,
    marginTop: SPACING.m,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
  },
  label: {
    marginBottom: SPACING.xs,
  },
  textAreaContainer: {
    marginBottom: SPACING.m,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    fontSize: 16,
    color: COLORS.light.text,
    backgroundColor: COLORS.light.surface,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    marginTop: SPACING.l,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.error,
    marginTop: SPACING.m,
  },
  deleteButtonText: {
    marginLeft: SPACING.xs,
  },
  imageUploadContainer: {
    marginBottom: SPACING.m,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    padding: SPACING.m,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.primary + '05',
  },
  imageUploadText: {
    marginLeft: SPACING.xs,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: RADIUS.m,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.m,
  },
  removeImageButton: {
    position: 'absolute',
    top: SPACING.s,
    right: SPACING.s,
    width: 32,
    height: 32,
    borderRadius: RADIUS.round,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
