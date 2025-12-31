import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { USER, HOME_FEED } from '@/data/mockData';
import { Bell, Plus, Compass, Bookmark, Share2, Heart, MessageCircle } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState(HOME_FEED);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Shuffle feed for demo
      setFeed([...feed].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1500);
  }, [feed]);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View>
          <Text variant="captionBold" color={COLORS.light.textSecondary}>Good morning,</Text>
          <Text variant="h2">{USER.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.push('/notifications')}
        >
          <Bell size={24} color={COLORS.light.text} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ padding: SPACING.l, gap: SPACING.l }}>
           <View style={{ flexDirection: 'row', gap: SPACING.m }}>
              {[1,2,3,4].map(i => (
                 <View key={i} style={{ width: 60, height: 80, borderRadius: RADIUS.m, backgroundColor: COLORS.light.surfaceHighlight }} />
              ))}
           </View>
           <View style={{ height: 220, borderRadius: RADIUS.xl, backgroundColor: COLORS.light.surfaceHighlight }} />
           <View style={{ gap: SPACING.l }}>
              {[1,2].map(i => (
                 <View key={i} style={{ height: 200, borderRadius: RADIUS.l, backgroundColor: COLORS.light.surfaceHighlight }} />
              ))}
           </View>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        >
          {/* Quick Actions */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.actionsContainer}
            style={styles.actionsScroll}
          >
            <QuickAction icon={<Plus size={20} color="#FFF" />} label="Add New" primary />
            <QuickAction icon={<Compass size={20} color={COLORS.light.text} />} label="Explore" />
            <QuickAction icon={<Bookmark size={20} color={COLORS.light.text} />} label="Saved" />
            <QuickAction icon={<Share2 size={20} color={COLORS.light.text} />} label="Share" />
          </ScrollView>

          {/* Featured Card */}
          <Text variant="h3" style={styles.sectionTitle}>Featured</Text>
          <TouchableOpacity onPress={() => router.push('/item-detail')} activeOpacity={0.9}>
            <Card padding="none" style={styles.featuredCard}>
              <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' }}
                style={styles.featuredImage}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.gradient}
                >
                  <View style={styles.featuredContent}>
                    <View style={styles.tag}>
                      <Text variant="captionBold" color="#FFF">PREMIUM</Text>
                    </View>
                    <Text variant="h2" color="#FFF" style={styles.featuredTitle}>Design Trends 2024</Text>
                    <Text variant="body" color="rgba(255,255,255,0.8)">Discover the latest UI/UX patterns shaping mobile apps.</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </Card>
          </TouchableOpacity>

          {/* Feed */}
          <Text variant="h3" style={styles.sectionTitle}>Latest Updates</Text>
          <View style={styles.feed}>
            {feed.map((item) => (
              <FeedCard key={item.id} item={item} onPress={() => router.push('/item-detail')} />
            ))}
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const QuickAction = ({ icon, label, primary }: { icon: React.ReactNode, label: string, primary?: boolean }) => (
  <TouchableOpacity style={styles.actionItem}>
    <View style={[
      styles.actionIcon, 
      primary ? { backgroundColor: COLORS.primary } : { backgroundColor: COLORS.light.surface, borderWidth: 1, borderColor: COLORS.light.border }
    ]}>
      {icon}
    </View>
    <Text variant="captionBold" style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const FeedCard = ({ item, onPress }: { item: typeof HOME_FEED[0], onPress: () => void }) => (
  <Card style={styles.feedCard} padding="none" onPress={onPress}>
    <Image source={{ uri: item.imageUrl }} style={styles.feedImage} contentFit="cover" transition={300} />
    <View style={styles.feedContent}>
      <View style={styles.feedHeader}>
        <View style={styles.feedTag}>
          <Text variant="captionBold" color={COLORS.primary} style={{ fontSize: 10 }}>{item.tag.toUpperCase()}</Text>
        </View>
        <Text variant="caption" color={COLORS.light.textSecondary}>{item.timestamp}</Text>
      </View>
      <Text variant="h3" style={styles.feedTitle} numberOfLines={2}>{item.title}</Text>
      <Text variant="body" color={COLORS.light.textSecondary} numberOfLines={2} style={styles.feedSubtitle}>{item.subtitle}</Text>
      
      <View style={styles.feedFooter}>
        <View style={styles.feedStat}>
          <Heart size={16} color={COLORS.light.textSecondary} />
          <Text variant="captionBold" color={COLORS.light.textSecondary}>{item.likes}</Text>
        </View>
        <View style={styles.feedStat}>
          <MessageCircle size={16} color={COLORS.light.textSecondary} />
          <Text variant="captionBold" color={COLORS.light.textSecondary}>{item.comments}</Text>
        </View>
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1,
    borderColor: COLORS.light.surface,
  },
  content: {
    paddingBottom: 100,
  },
  actionsScroll: {
    flexGrow: 0,
    marginTop: SPACING.m,
  },
  actionsContainer: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
    paddingBottom: SPACING.m,
  },
  actionItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
  },
  featuredCard: {
    marginHorizontal: SPACING.l,
    height: 220,
    borderRadius: RADIUS.xl,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACING.l,
  },
  featuredContent: {
    gap: SPACING.xs,
  },
  tag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: RADIUS.s,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  featuredTitle: {
    marginBottom: 4,
  },
  feed: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.l,
  },
  feedCard: {
    borderRadius: RADIUS.l,
  },
  feedImage: {
    width: '100%',
    height: 180,
  },
  feedContent: {
    padding: SPACING.l,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  feedTag: {
    backgroundColor: 'rgba(0, 102, 255, 0.1)',
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: RADIUS.s,
  },
  feedTitle: {
    marginBottom: SPACING.xs,
  },
  feedSubtitle: {
    marginBottom: SPACING.m,
  },
  feedFooter: {
    flexDirection: 'row',
    gap: SPACING.l,
  },
  feedStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
