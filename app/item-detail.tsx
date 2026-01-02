import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Image } from 'expo-image';
import { Heart, Share2, Bookmark, MessageCircle, ArrowLeft } from 'lucide-react-native';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <ScreenWrapper safeArea={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' }} 
            style={{ width, height: width * 0.8 }}
            contentFit="cover"
          />
          <View style={styles.imageOverlay}>
             <TouchableOpacity 
               style={styles.backButton} 
               onPress={() => {
                 if (router.canGoBack()) {
                   router.back();
                 } else {
                   router.replace('/(tabs)/home');
                 }
               }}
               activeOpacity={0.7}
             >
               <View style={styles.backButtonContent}>
                 <ArrowLeft size={24} color="#FFF" />
               </View>
             </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.tag}>
              <Text variant="captionBold" color={COLORS.primary}>DESIGN</Text>
            </View>
            <Text variant="caption" color={COLORS.light.textSecondary}>2 hours ago</Text>
          </View>

          <Text variant="h1" style={styles.title}>Design Trends 2024</Text>
          <Text variant="h3" color={COLORS.light.textSecondary} style={styles.subtitle}>
            Discover the latest UI/UX patterns shaping mobile apps.
          </Text>

          <View style={styles.authorRow}>
            <Image 
               source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }}
               style={styles.authorAvatar}
            />
            <View>
              <Text variant="bodyBold">Alex Morgan</Text>
              <Text variant="caption" color={COLORS.light.textSecondary}>@alexm</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionBtn, liked && styles.activeActionBtn]} 
              onPress={() => setLiked(!liked)}
            >
              <Heart size={24} color={liked ? COLORS.error : COLORS.light.text} fill={liked ? COLORS.error : 'none'} />
              <Text variant="captionBold" color={liked ? COLORS.error : COLORS.light.text}>2.4k</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <MessageCircle size={24} color={COLORS.light.text} />
              <Text variant="captionBold" color={COLORS.light.text}>48</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, saved && styles.activeActionBtn]}
              onPress={() => setSaved(!saved)}
            >
              <Bookmark size={24} color={saved ? COLORS.primary : COLORS.light.text} fill={saved ? COLORS.primary : 'none'} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Share2 size={24} color={COLORS.light.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text variant="body" style={styles.bodyText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            {'\n\n'}
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Text>

          <Button 
            label="Read Full Article" 
            onPress={() => {}} 
            style={styles.ctaButton}
            variant="primary"
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xl,
  },
  imageContainer: {
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60, // Adjust for safe area
    paddingHorizontal: SPACING.l,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonContent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.l,
    marginTop: -24,
    backgroundColor: COLORS.light.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  tag: {
    backgroundColor: 'rgba(0, 102, 255, 0.1)',
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: RADIUS.s,
  },
  title: {
    marginBottom: SPACING.s,
  },
  subtitle: {
    marginBottom: SPACING.l,
    lineHeight: 28,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.m,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
    backgroundColor: COLORS.light.surface,
    padding: SPACING.m,
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeActionBtn: {
    opacity: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.light.border,
    marginBottom: SPACING.l,
  },
  bodyText: {
    color: COLORS.light.textSecondary,
    marginBottom: SPACING.xl,
  },
  ctaButton: {
    width: '100%',
  },
});
