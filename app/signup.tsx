import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { User, Mail, Lock, ArrowLeft, Check } from 'lucide-react-native';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSignup = () => {
    if (!agreed) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/home');
    }, 1500);
  };

  return (
    <ScreenWrapper style={styles.container}>
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
            <Text variant="h1" style={styles.title}>Create account</Text>
            <Text variant="body" color={COLORS.light.textSecondary}>
              Start your journey with us today.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              icon={<User size={20} color={COLORS.light.textSecondary} />}
            />
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
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Lock size={20} color={COLORS.light.textSecondary} />}
            />
            
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Check size={14} color="#FFF" />}
              </View>
              <Text variant="caption" color={COLORS.light.textSecondary} style={styles.checkboxText}>
                I agree to the <Text variant="captionBold" color={COLORS.primary}>Terms of Service</Text> and <Text variant="captionBold" color={COLORS.primary}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            <Button
              label="Create Account"
              onPress={handleSignup}
              isLoading={isLoading}
              disabled={!agreed}
              style={styles.signupButton}
            />
          </View>
          
          <View style={styles.footer}>
            <Text variant="body" color={COLORS.light.textSecondary}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text variant="bodyBold" color={COLORS.primary}>Log in</Text>
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.l,
    flexGrow: 1,
  },
  titleContainer: {
    marginBottom: SPACING.xl,
    marginTop: SPACING.m,
  },
  title: {
    marginBottom: SPACING.s,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.s - 4,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    marginRight: SPACING.s,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light.surface,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxText: {
    flex: 1,
    lineHeight: 20,
  },
  signupButton: {
    marginTop: SPACING.s,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: SPACING.l,
  },
});
