import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { FEATURES_LIST } from '@/data/mockData';
import { Search, ChevronRight, Layers, PanelBottom, PieChart, Type, List, Moon, Smartphone, Settings } from 'lucide-react-native';

const ICON_MAP: Record<string, React.ReactNode> = {
  'Layers': <Layers size={24} color={COLORS.primary} />,
  'PanelBottom': <PanelBottom size={24} color={COLORS.primary} />,
  'PieChart': <PieChart size={24} color={COLORS.primary} />,
  'Type': <Type size={24} color={COLORS.primary} />,
  'List': <List size={24} color={COLORS.primary} />,
  'Moon': <Moon size={24} color={COLORS.primary} />,
  'Smartphone': <Smartphone size={24} color={COLORS.primary} />,
  'Settings': <Settings size={24} color={COLORS.primary} />,
};

export default function FeaturesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredFeatures = FEATURES_LIST.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>Components</Text>
        <Text variant="body" color={COLORS.light.textSecondary}>
          Explore the building blocks of this template.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Input 
          placeholder="Search components..."
          value={search}
          onChangeText={setSearch}
          icon={<Search size={20} color={COLORS.light.textSecondary} />}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      <FlatList
        data={filteredFeatures}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push('/feature-detail')} activeOpacity={0.7}>
            <Card style={styles.card}>
              <View style={styles.iconContainer}>
                {ICON_MAP[item.icon] || <Layers size={24} color={COLORS.primary} />}
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text variant="h3" style={styles.cardTitle}>{item.name}</Text>
                  <View style={styles.categoryTag}>
                    <Text variant="captionBold" color={COLORS.light.textSecondary} style={{fontSize: 10}}>{item.category.toUpperCase()}</Text>
                  </View>
                </View>
                <Text variant="body" color={COLORS.light.textSecondary} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              <ChevronRight size={20} color={COLORS.light.textSecondary} />
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="body" color={COLORS.light.textSecondary}>No components found.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: SPACING.l,
    paddingBottom: SPACING.m,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  searchContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  list: {
    padding: SPACING.l,
    gap: SPACING.l,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.m,
    backgroundColor: 'rgba(0, 102, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  cardContent: {
    flex: 1,
    marginRight: SPACING.s,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
  },
  categoryTag: {
    backgroundColor: COLORS.light.surfaceHighlight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
});
