import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Layers } from 'lucide-react-native';

export default function FeatureDetailScreen() {
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Layers size={40} color={COLORS.primary} />
          </View>
          <Text variant="h1" align="center" style={styles.title}>Animated Cards</Text>
          <Text variant="body" align="center" color={COLORS.light.textSecondary}>
            Smooth interactions and elevation changes on press.
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewArea}>
             <Card style={styles.demoCard} onPress={() => {}}>
                <Text variant="h3">Tap Me</Text>
                <Text variant="body" color={COLORS.light.textSecondary}>I have a nice press animation.</Text>
             </Card>

             <Card style={styles.demoCard} variant="outlined" onPress={() => {}}>
                <Text variant="h3">Outlined</Text>
                <Text variant="body" color={COLORS.light.textSecondary}>I am subtle.</Text>
             </Card>
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Usage</Text>
          <Card padding="l">
            <Text variant="body" style={styles.code}>
              {'<Card onPress={() => {}}>\n  <Content />\n</Card>'}
            </Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Props</Text>
          <View style={styles.propRow}>
            <Text variant="bodyBold">variant</Text>
            <Text variant="caption" color={COLORS.light.textSecondary}>&apos;elevated&apos; | &apos;outlined&apos; | &apos;flat&apos;</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.propRow}>
            <Text variant="bodyBold">onPress</Text>
            <Text variant="caption" color={COLORS.light.textSecondary}>function (optional)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.propRow}>
            <Text variant="bodyBold">padding</Text>
            <Text variant="caption" color={COLORS.light.textSecondary}>Spacing key</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.l,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    backgroundColor: 'rgba(0, 102, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  title: {
    marginBottom: SPACING.s,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.m,
  },
  previewArea: {
    gap: SPACING.m,
  },
  demoCard: {
    padding: SPACING.l,
  },
  code: {
    fontFamily: 'monospace',
    color: COLORS.primary,
  },
  propRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.light.border,
  },
});
