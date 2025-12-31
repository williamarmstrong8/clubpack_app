import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING } from '@/constants/theme';
import { Bell, Lock, Eye } from 'lucide-react-native';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);

  const showSaveToast = () => {
    // In a real app, show a toast here
    console.log('Settings saved');
  };

  const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
    setter(!value);
    showSaveToast();
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text variant="h3" style={styles.sectionTitle}>Notifications</Text>
        <Card style={styles.section} padding="none">
           <SettingRow 
              icon={<Bell size={20} color={COLORS.primary} />}
              label="Push Notifications"
              value={pushEnabled}
              onValueChange={() => toggle(setPushEnabled, pushEnabled)}
           />
           <View style={styles.divider} />
           <SettingRow 
              icon={<Bell size={20} color={COLORS.secondary} />}
              label="Email Updates"
              value={emailEnabled}
              onValueChange={() => toggle(setEmailEnabled, emailEnabled)}
           />
        </Card>

        <Text variant="h3" style={styles.sectionTitle}>Privacy & Security</Text>
        <Card style={styles.section} padding="none">
           <SettingRow 
              icon={<Lock size={20} color={COLORS.success} />}
              label="Face ID Login"
              value={faceIdEnabled}
              onValueChange={() => toggle(setFaceIdEnabled, faceIdEnabled)}
           />
           <View style={styles.divider} />
           <SettingRow 
              icon={<Eye size={20} color={COLORS.warning} />}
              label="Profile Visibility"
              value={true}
              onValueChange={() => {}}
              disabled
           />
        </Card>

        <Text variant="h3" style={styles.sectionTitle}>Danger Zone</Text>
        <Card style={styles.dangerSection} padding="l">
           <Text variant="bodyBold" color={COLORS.error} style={{ marginBottom: SPACING.s }}>Delete Account</Text>
           <Text variant="caption" color={COLORS.light.textSecondary} style={{ marginBottom: SPACING.m }}>
              Permanently remove your account and all of your data. This action cannot be undone.
           </Text>
           <Button 
              label="Delete Account" 
              variant="danger" 
              size="small"
              onPress={() => Alert.alert('Delete Account', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive' }])}
           />
        </Card>

      </ScrollView>
    </ScreenWrapper>
  );
}

const SettingRow = ({ icon, label, value, onValueChange, disabled }: { icon: React.ReactNode, label: string, value: boolean, onValueChange: () => void, disabled?: boolean }) => (
   <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <Text variant="body" style={styles.rowLabel}>{label}</Text>
      <Switch 
         value={value} 
         onValueChange={onValueChange} 
         trackColor={{ false: COLORS.light.border, true: COLORS.primary }}
         disabled={disabled}
      />
   </View>
);

const styles = StyleSheet.create({
  container: {
    padding: SPACING.l,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.m,
    marginTop: SPACING.s,
  },
  section: {
    marginBottom: SPACING.l,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    backgroundColor: COLORS.light.surface,
  },
  rowIcon: {
    marginRight: SPACING.m,
  },
  rowLabel: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.light.border,
    marginLeft: 56,
  },
  dangerSection: {
    borderColor: 'rgba(255, 59, 48, 0.3)',
    borderWidth: 1,
  },
});
