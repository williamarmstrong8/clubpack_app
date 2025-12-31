import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <ScreenWrapper style={styles.container}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.content}>
         <Text variant="h1" align="center" style={styles.title}>404</Text>
         <Text variant="h3" align="center" style={styles.subtitle}>Page Not Found</Text>
         <Text variant="body" align="center" color={COLORS.light.textSecondary} style={styles.description}>
            The screen you are looking for does not exist.
         </Text>

         <Link href="/" asChild>
            <Button label="Go to Home" onPress={() => {}} style={styles.button} />
         </Link>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 80,
    color: COLORS.primary,
    marginBottom: SPACING.s,
  },
  subtitle: {
    marginBottom: SPACING.m,
  },
  description: {
    marginBottom: SPACING.xl,
  },
  button: {
    minWidth: 200,
  },
});
