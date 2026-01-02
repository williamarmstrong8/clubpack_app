import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { Image } from 'expo-image';
import { Settings, Moon, Bell, Shield, CircleHelp, LogOut, ChevronRight, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text variant="h2" color={COLORS.primary}>{initials}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBadge}>
               <User size={12} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text variant="h2" align="center" style={styles.name}>{displayName}</Text>
          <Text variant="body" align="center" color={COLORS.light.textSecondary}>{userEmail}</Text>
          {profile?.role && (
            <Text variant="caption" align="center" color={COLORS.primary} style={styles.role}>
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </Text>
          )}
          
          <Button 
            label="Edit Profile" 
            variant="outline" 
            size="small" 
            onPress={() => router.push('/edit-profile')} 
            style={styles.editButton}
          />
        </View>

        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Preferences</Text>
          <Card style={styles.menuCard} padding="none">
            <MenuItem 
               icon={<Settings size={20} color={COLORS.primary} />} 
               label="Settings" 
               onPress={() => router.push('/settings')} 
            />
            <View style={styles.divider} />
            <View style={styles.menuItem}>
               <View style={styles.menuIconContainer}>
                  <Moon size={20} color={COLORS.primary} />
               </View>
               <Text variant="bodyBold" style={styles.menuLabel}>Dark Mode</Text>
               <Switch 
                  value={isDarkMode} 
                  onValueChange={setIsDarkMode} 
                  trackColor={{ false: COLORS.light.border, true: COLORS.primary }}
               />
            </View>
            <View style={styles.divider} />
            <View style={styles.menuItem}>
               <View style={styles.menuIconContainer}>
                  <Bell size={20} color={COLORS.primary} />
               </View>
               <Text variant="bodyBold" style={styles.menuLabel}>Notifications</Text>
               <Switch 
                  value={notifications} 
                  onValueChange={setNotifications}
                  trackColor={{ false: COLORS.light.border, true: COLORS.primary }}
               />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Support</Text>
          <Card style={styles.menuCard} padding="none">
            <MenuItem 
               icon={<Shield size={20} color={COLORS.success} />} 
               label="Privacy Policy" 
               onPress={() => {}} 
            />
            <View style={styles.divider} />
            <MenuItem 
               icon={<CircleHelp size={20} color={COLORS.warning} />} 
               label="Help & Support" 
               onPress={() => {}} 
            />
          </Card>
        </View>

        <Button 
           label="Sign Out" 
           variant="ghost" 
           onPress={handleSignOut} 
           style={styles.logoutButton}
           icon={<LogOut size={20} color={COLORS.error} />}
        />
        <Text variant="caption" align="center" color={COLORS.light.textSecondary} style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const MenuItem = ({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress: () => void }) => (
   <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
         {icon}
      </View>
      <Text variant="bodyBold" style={styles.menuLabel}>{label}</Text>
      <ChevronRight size={20} color={COLORS.light.textSecondary} />
   </TouchableOpacity>
);

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.l,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.light.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.light.border,
  },
  role: {
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.light.background,
  },
  name: {
    marginBottom: 4,
  },
  bio: {
    marginTop: SPACING.s,
    maxWidth: '80%',
    lineHeight: 18,
  },
  editButton: {
    marginTop: SPACING.l,
  },
  section: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.m,
  },
  menuCard: {
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    backgroundColor: COLORS.light.surface,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.light.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  menuLabel: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.light.border,
    marginLeft: 68, // Icon width + margin + padding
  },
  logoutButton: {
    marginBottom: SPACING.m,
  },
  version: {
    marginBottom: SPACING.xl,
  },
});
