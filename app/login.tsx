import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Profile } from '@/lib/supabase';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const blobAnim = React.useRef(new Animated.Value(0)).current;

  // ClubPack colors: blue-600 (#2563eb) to violet-600 (#9333ea)
  const clubpackBlue = '#2563eb';
  const clubpackViolet = '#9333ea';

  React.useEffect(() => {
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
    ).start();
  }, [blobAnim]);

  const blobTranslateY = blobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/home');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        console.error('Error signing in:', signInError.message);
        // Set user-friendly error message
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else {
          setError('An error occurred during sign in. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      // Check user role and redirect accordingly
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single<Pick<Profile, 'role'>>();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        // Redirect to home (both admin and regular users go to same place for now)
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Don't render login page if user is authenticated (will redirect)
  if (loading || user) {
    return null;
  }

  return (
    <ScreenWrapper style={styles.container}>
      {/* Background Gradient Blobs */}
      <Animated.View 
        style={[
          styles.blobBlue, 
          { 
            transform: [{ translateY: blobTranslateY }],
            opacity: 0.1 
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.blobViolet, 
          { 
            transform: [{ translateY: blobTranslateY }],
            opacity: 0.1 
          }
        ]} 
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.light.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/Club-Pack-Logo.svg')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
            <Text variant="h1" style={styles.title}>Welcome back</Text>
            <Text variant="body" color={COLORS.light.textSecondary}>
              Sign in to your ClubPack account
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={20} color={COLORS.light.textSecondary} />}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Lock size={20} color={COLORS.light.textSecondary} />}
            />
            
            {error ? (
              <View style={styles.errorContainer}>
                <Text variant="caption" color={COLORS.error} style={styles.errorText}>
                  {error}
                </Text>
              </View>
            ) : null}
            
            <TouchableOpacity style={styles.forgotPassword}>
              <Text variant="captionBold" color={clubpackBlue}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
              style={styles.gradientButton}
            >
              <LinearGradient
                colors={[clubpackBlue, clubpackViolet]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientInner}
              >
                {isLoading ? (
                  <Text variant="bodyBold" color="#FFFFFF">
                    Logging in...
                  </Text>
                ) : (
                  <Text variant="bodyBold" color="#FFFFFF">
                    Log In
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.s,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    padding: SPACING.l,
    flexGrow: 1,
  },
  titleContainer: {
    marginBottom: SPACING.xl,
    marginTop: SPACING.m,
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    marginBottom: SPACING.l,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
  },
  title: {
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.l,
  },
  gradientButton: {
    width: '100%',
    borderRadius: RADIUS.m,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  gradientInner: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.l,
  },
  errorContainer: {
    marginTop: SPACING.s,
    marginBottom: SPACING.m,
    padding: SPACING.s,
    backgroundColor: COLORS.error + '10',
    borderRadius: RADIUS.s,
  },
  errorText: {
    textAlign: 'center',
  },
  blobBlue: {
    position: 'absolute',
    top: -width * 0.3,
    left: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#2563eb',
  },
  blobViolet: {
    position: 'absolute',
    bottom: -width * 0.2,
    right: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#9333ea',
  },
});
