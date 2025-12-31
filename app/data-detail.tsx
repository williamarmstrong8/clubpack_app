import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { TrendingUp, Calendar, DollarSign, Activity } from 'lucide-react-native';

export default function DataDetailScreen() {
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="captionBold" color={COLORS.primary}>PROJECT ALPHA</Text>
          <Text variant="h1" style={styles.title}>Performance Analysis</Text>
          <View style={styles.statusBadge}>
             <Text variant="captionBold" color={COLORS.success}>COMPLETED</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
           <Card style={styles.statCard} padding="m">
              <DollarSign size={20} color={COLORS.primary} style={styles.statIcon} />
              <Text variant="caption" color={COLORS.light.textSecondary}>Budget</Text>
              <Text variant="h3">$12,000</Text>
           </Card>
           <Card style={styles.statCard} padding="m">
              <Calendar size={20} color={COLORS.warning} style={styles.statIcon} />
              <Text variant="caption" color={COLORS.light.textSecondary}>Timeline</Text>
              <Text variant="h3">3 Weeks</Text>
           </Card>
           <Card style={styles.statCard} padding="m">
              <Activity size={20} color={COLORS.error} style={styles.statIcon} />
              <Text variant="caption" color={COLORS.light.textSecondary}>Issues</Text>
              <Text variant="h3">2 Open</Text>
           </Card>
           <Card style={styles.statCard} padding="m">
              <TrendingUp size={20} color={COLORS.success} style={styles.statIcon} />
              <Text variant="caption" color={COLORS.light.textSecondary}>ROI</Text>
              <Text variant="h3">145%</Text>
           </Card>
        </View>

        <View style={styles.section}>
           <Text variant="h3" style={styles.sectionTitle}>Timeline</Text>
           <View style={styles.timeline}>
              <TimelineItem date="Oct 24" title="Project Completed" completed isLast />
              <TimelineItem date="Oct 20" title="Final Review" completed />
              <TimelineItem date="Oct 15" title="Development Phase" completed />
              <TimelineItem date="Oct 01" title="Kickoff Meeting" completed />
           </View>
        </View>

        <View style={styles.section}>
           <Text variant="h3" style={styles.sectionTitle}>Summary</Text>
           <Card>
              <Text variant="body" color={COLORS.light.textSecondary}>
                 Project Alpha exceeded expectations with a 145% ROI. The team delivered all milestones ahead of schedule. Key achievements include optimization of the core algorithm and a complete UI overhaul.
              </Text>
           </Card>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const TimelineItem = ({ date, title, completed, isLast }: { date: string, title: string, completed: boolean, isLast?: boolean }) => (
   <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
         <Text variant="captionBold" color={COLORS.light.textSecondary} style={{ width: 50 }}>{date}</Text>
         <View style={styles.timelineDotContainer}>
            <View style={[styles.timelineDot, completed && styles.timelineDotActive]} />
            {!isLast && <View style={styles.timelineLine} />}
         </View>
      </View>
      <View style={styles.timelineContent}>
         <Text variant="bodyBold">{title}</Text>
      </View>
   </View>
);

const styles = StyleSheet.create({
  container: {
    padding: SPACING.l,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.m,
    marginTop: SPACING.xs,
  },
  statusBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.s,
    alignSelf: 'flex-start',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.m,
    marginBottom: SPACING.xl,
  },
  statCard: {
    width: '47%',
  },
  statIcon: {
    marginBottom: SPACING.s,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.m,
  },
  timeline: {
    paddingLeft: SPACING.s,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
    minHeight: 50,
  },
  timelineLeft: {
    flexDirection: 'row',
  },
  timelineDotContainer: {
    alignItems: 'center',
    marginHorizontal: SPACING.m,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.light.border,
    borderWidth: 2,
    borderColor: COLORS.light.background,
  },
  timelineDotActive: {
    backgroundColor: COLORS.success,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.light.border,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    paddingTop: -4,
  },
});
