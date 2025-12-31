import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { NOTIFICATIONS } from '@/data/mockData';
import { Bell, User, Briefcase, Shield, AlertCircle } from 'lucide-react-native';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return <User size={20} color="#FFF" />;
      case 'work': return <Briefcase size={20} color="#FFF" />;
      case 'security': return <Shield size={20} color="#FFF" />;
      case 'system': return <AlertCircle size={20} color="#FFF" />;
      default: return <Bell size={20} color="#FFF" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'user': return COLORS.primary;
      case 'work': return COLORS.success;
      case 'security': return COLORS.error;
      case 'system': return COLORS.warning;
      default: return COLORS.secondary;
    }
  };

  return (
    <ScreenWrapper>
      {notifications.length > 0 && (
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
            <Text variant="captionBold" color={COLORS.primary}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.item, !item.read && styles.unreadItem]}>
            <View style={[styles.iconContainer, { backgroundColor: getIconBg(item.type) }]}>
              {getIcon(item.type)}
            </View>
            <View style={styles.content}>
              <View style={styles.row}>
                <Text variant="bodyBold" style={styles.title}>{item.title}</Text>
                <Text variant="caption" color={COLORS.light.textSecondary}>{item.time}</Text>
              </View>
              <Text variant="body" color={COLORS.light.textSecondary} numberOfLines={2}>
                {item.body}
              </Text>
            </View>
            {!item.read && <View style={styles.dot} />}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Bell size={40} color={COLORS.light.textSecondary} />
            </View>
            <Text variant="h3" align="center" style={styles.emptyTitle}>No Notifications</Text>
            <Text variant="body" align="center" color={COLORS.light.textSecondary}>
              You&apos;re all caught up! Check back later.
            </Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
  },
  clearButton: {
    padding: SPACING.s,
  },
  list: {
    paddingBottom: SPACING.xl,
  },
  item: {
    flexDirection: 'row',
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
    backgroundColor: COLORS.light.surface,
  },
  unreadItem: {
    backgroundColor: COLORS.light.surfaceHighlight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    marginRight: SPACING.s,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.s,
    marginTop: 6,
  },
  emptyState: {
    padding: SPACING.xxl,
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.light.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  emptyTitle: {
    marginBottom: SPACING.s,
  },
});
