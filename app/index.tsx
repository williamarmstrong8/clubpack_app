import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Users, Calendar, Zap } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/home');
    }
  }, [user, loading, router]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(blobAnim, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(blobAnim, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [blobAnim, fadeAnim, slideAnim]);

  const blobTranslateY = blobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  // ClubPack colors: blue-600 (#2563eb) to violet-600 (#9333ea)
  const clubpackBlue = '#2563eb';
  const clubpackViolet = '#9333ea';

  // Don't render landing page if user is authenticated (will redirect)
  if (loading || user) {
    return null;
  }

  return (
    <ScreenWrapper style={styles.container} safeArea={false}>
      <StatusBar style="dark" />
      
      {/* Background Gradient Blobs */}
      <Animated.View 
        style={[
          styles.blobBlue, 
          { 
            transform: [{ translateY: blobTranslateY }],
            opacity: 0.15 
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.blobViolet, 
          { 
            transform: [{ translateY: blobTranslateY }],
            opacity: 0.15 
          }
        ]} 
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/Club-Pack-Logo.svg')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
            <Text variant="h1" align="center" style={styles.title}>
              ClubPack
            </Text>
            <Text variant="body" align="center" color={COLORS.light.textSecondary} style={styles.subtitle}>
              Build your club website, manage members, and plan events all in one platform.
            </Text>
          </Animated.View>
        </View>

        <Animated.View 
          style={[
            styles.features,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <FeatureItem icon={<Users size={20} color={clubpackBlue} />} text="Member Management" />
          <FeatureItem icon={<Calendar size={20} color={clubpackViolet} />} text="Event Planning" />
          <FeatureItem icon={<Zap size={20} color={clubpackBlue} />} text="Club Websites" />
        </Animated.View>

        <Animated.View 
          style={[
            styles.footer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
            style={styles.gradientButton}
          >
            <LinearGradient
              colors={[clubpackBlue, clubpackViolet]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientInner}
            >
              <Text variant="bodyBold" color="#FFFFFF" style={styles.buttonText}>
                Log In
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}

const FeatureItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>{icon}</View>
    <Text variant="captionBold">{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'transparent',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.l,
    alignSelf: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    marginBottom: SPACING.s,
  },
  subtitle: {
    maxWidth: 280,
    lineHeight: 24,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xxl,
  },
  featureItem: {
    alignItems: 'center',
    gap: SPACING.s,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  footer: {
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  blobBlue: {
    position: 'absolute',
    top: -width * 0.4,
    left: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#2563eb',
  },
  blobViolet: {
    position: 'absolute',
    bottom: -width * 0.3,
    right: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#9333ea',
  },
  gradientButton: {
    width: '100%',
    borderRadius: RADIUS.m,
    overflow: 'hidden',
  },
  gradientInner: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.l,
  },
  buttonText: {
    color: '#FFFFFF',
  },
});
