import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING } from '@/constants/theme';
import { Layers, Zap, Shield } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const blobAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <ScreenWrapper style={styles.container} safeArea={false}>
      <StatusBar style="dark" />
      
      {/* Background Decor */}
      <Animated.View 
        style={[
          styles.blob, 
          { 
            transform: [{ translateY: blobTranslateY }],
            opacity: 0.6 
          }
        ]} 
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.logoContainer}>
              <Layers size={48} color={COLORS.primary} />
            </View>
            <Text variant="h1" align="center" style={styles.title}>
              AppTemplate
            </Text>
            <Text variant="body" align="center" color={COLORS.light.textSecondary} style={styles.subtitle}>
              A modern mobile UI starter kit with premium components and smooth animations.
            </Text>
          </Animated.View>
        </View>

        <Animated.View 
          style={[
            styles.features,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <FeatureItem icon={<Layers size={20} color={COLORS.primary} />} text="Modern UI Kit" />
          <FeatureItem icon={<Zap size={20} color={COLORS.warning} />} text="Fast Performance" />
          <FeatureItem icon={<Shield size={20} color={COLORS.success} />} text="Secure & Scalable" />
        </Animated.View>

        <Animated.View 
          style={[
            styles.footer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Button 
            label="Sign Up" 
            onPress={() => router.push('/signup')} 
            style={styles.button}
          />
          <Button 
            label="Log In" 
            variant="secondary" 
            onPress={() => router.push('/login')} 
            style={styles.button}
          />
          <Button 
            label="Continue as Guest" 
            variant="ghost" 
            onPress={() => router.replace('/home')} 
            style={styles.ghostButton}
          />
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
    backgroundColor: COLORS.light.surface,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.l,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    alignSelf: 'center',
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
  button: {
    width: '100%',
  },
  ghostButton: {
    marginTop: -SPACING.s,
  },
  blob: {
    position: 'absolute',
    top: -width * 0.4,
    right: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
  },
});
