import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { useWebsite } from '@/contexts/WebsiteContext';
import { Image } from 'expo-image';
import { Search, Users, Mail, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import type { Membership } from '@/lib/supabase';

export default function MembersScreen() {
  const router = useRouter();
  const { websiteData, refetchMembers, isLoading } = useWebsite();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const members = websiteData.members || [];
  const stats = websiteData.memberStats;

  const filteredMembers = members.filter((member) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.name?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query)
    );
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchMembers();
    setRefreshing(false);
  }, [refetchMembers]);

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View>
          <Text variant="h1">Members</Text>
          <Text variant="body" color={COLORS.light.textSecondary}>
            {stats.total} total members
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <StatCard 
          value={stats.total}
          label="Total Members"
          change="+0%"
          trend="neutral"
        />
        <StatCard 
          value={stats.newThisMonth}
          label="New This Month"
          change={stats.newThisMonth > 0 ? `+${stats.newThisMonth}` : '0'}
          trend={stats.newThisMonth > 0 ? 'up' : 'neutral'}
        />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Search size={20} color={COLORS.light.textSecondary} />}
          style={styles.searchInput}
        />
      </View>

      {/* Members List */}
      {isLoading && members.length === 0 ? (
        <View style={styles.loadingContainer}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonAvatar} />
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
          {filteredMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={48} color={COLORS.light.textSecondary} />
              <Text variant="h3" align="center" style={styles.emptyTitle}>
                {searchQuery ? 'No members found' : 'No members yet'}
              </Text>
              <Text variant="body" align="center" color={COLORS.light.textSecondary}>
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Members will appear here once they join your club'
                }
              </Text>
            </View>
          ) : (
            filteredMembers.map((member) => (
              <MemberCard key={member.id} member={member} getInitials={getInitials} formatDate={formatDate} />
            ))
          )}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const StatCard = ({ 
  value, 
  label, 
  change, 
  trend 
}: { 
  value: number, 
  label: string,
  change: string,
  trend: 'up' | 'down' | 'neutral'
}) => (
  <Card style={styles.statCard} padding="l">
    <Text variant="captionBold" color={COLORS.light.textSecondary} style={styles.statLabel}>
      {label.toUpperCase()}
    </Text>
    <Text variant="h2" style={styles.statValue}>{value}</Text>
    <View style={styles.trendRow}>
      {trend === 'up' && <TrendingUp size={16} color={COLORS.success} />}
      {trend === 'down' && <TrendingDown size={16} color={COLORS.error} />}
      {trend === 'neutral' && <Minus size={16} color={COLORS.warning} />}
      <Text 
        variant="captionBold" 
        color={trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.error : COLORS.warning}
        style={styles.trendText}
      >
        {change}
      </Text>
      <Text variant="caption" color={COLORS.light.textSecondary} style={{ marginLeft: 4 }}>
        vs last month
      </Text>
    </View>
  </Card>
);

const MemberCard = ({ 
  member, 
  getInitials, 
  formatDate 
}: { 
  member: Membership, 
  getInitials: (name: string | null) => string,
  formatDate: (date: string | null) => string
}) => {
  return (
    <Card style={styles.memberCard} padding="l">
      <View style={styles.memberContent}>
        <View style={styles.memberLeft}>
          {member.avatar_url ? (
            <Image 
              source={{ uri: member.avatar_url }} 
              style={styles.memberAvatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.memberAvatar, styles.avatarPlaceholder]}>
              <Text variant="bodyBold" color={COLORS.primary}>
                {getInitials(member.name)}
              </Text>
            </View>
          )}
          <View style={styles.memberInfo}>
            <Text variant="bodyBold" style={styles.memberName}>
              {member.name || 'Unnamed Member'}
            </Text>
            {member.role && (
              <View style={styles.roleBadge}>
                <Text variant="captionBold" color={COLORS.primary}>
                  {member.role}
                </Text>
              </View>
            )}
            <View style={styles.memberDetails}>
              {member.email && (
                <View style={styles.memberDetail}>
                  <Mail size={14} color={COLORS.light.textSecondary} />
                  <Text variant="caption" color={COLORS.light.textSecondary} numberOfLines={1} style={styles.memberDetailText}>
                    {member.email}
                  </Text>
                </View>
              )}
              {member.joined_at && (
                <View style={styles.memberDetail}>
                  <Calendar size={14} color={COLORS.light.textSecondary} />
                  <Text variant="caption" color={COLORS.light.textSecondary}>
                    {formatDate(member.joined_at)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  statCard: {
    width: '47%', // roughly half minus gap
  },
  statLabel: {
    marginBottom: SPACING.xs,
    fontSize: 10,
  },
  statValue: {
    marginBottom: SPACING.xs,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    marginLeft: 2,
  },
  searchContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  searchInput: {
    marginBottom: 0,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
    gap: SPACING.m,
  },
  loadingContainer: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    padding: SPACING.l,
    backgroundColor: COLORS.light.surface,
    borderRadius: RADIUS.l,
  },
  skeletonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  memberCard: {
    borderRadius: RADIUS.l,
    minHeight: 100,
  },
  memberContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.m,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.light.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  memberInfo: {
    flex: 1,
    gap: SPACING.xs,
    justifyContent: 'center',
  },
  memberName: {
    marginBottom: 0,
  },
  memberDetails: {
    gap: SPACING.xs,
  },
  memberDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  memberDetailText: {
    flex: 1,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.primary + '10',
  },
});

