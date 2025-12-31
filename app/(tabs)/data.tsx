import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { DATA_METRICS } from '@/data/mockData';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, MoreHorizontal, Download } from 'lucide-react-native';

export default function DataScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'insights'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <Text variant="h1">Analytics</Text>
        </View>
        <View style={{ padding: SPACING.l, gap: SPACING.l }}>
           <View style={{ flexDirection: 'row', gap: SPACING.m, flexWrap: 'wrap' }}>
              {[1,2,3,4].map(i => (
                 <View key={i} style={{ width: '47%', height: 100, borderRadius: RADIUS.l, backgroundColor: COLORS.light.surfaceHighlight }} />
              ))}
           </View>
           <View style={{ height: 300, borderRadius: RADIUS.l, backgroundColor: COLORS.light.surfaceHighlight }} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text variant="h1">Analytics</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Download size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TabButton label="Overview" isActive={activeTab === 'overview'} onPress={() => setActiveTab('overview')} />
          <TabButton label="Table" isActive={activeTab === 'table'} onPress={() => setActiveTab('table')} />
          <TabButton label="Insights" isActive={activeTab === 'insights'} onPress={() => setActiveTab('insights')} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          {DATA_METRICS.kpi.map((kpi) => (
            <Card key={kpi.id} style={styles.kpiCard} padding="l">
              <Text variant="captionBold" color={COLORS.light.textSecondary} style={styles.kpiLabel}>{kpi.label.toUpperCase()}</Text>
              <Text variant="h2" style={styles.kpiValue}>{kpi.value}</Text>
              <View style={styles.trendRow}>
                {kpi.trend === 'up' && <TrendingUp size={16} color={COLORS.success} />}
                {kpi.trend === 'down' && <TrendingDown size={16} color={COLORS.error} />}
                {kpi.trend === 'neutral' && <Minus size={16} color={COLORS.warning} />}
                <Text 
                  variant="captionBold" 
                  color={kpi.trend === 'up' ? COLORS.success : kpi.trend === 'down' ? COLORS.error : COLORS.warning}
                  style={styles.trendText}
                >
                  {kpi.change}
                </Text>
                <Text variant="caption" color={COLORS.light.textSecondary} style={{ marginLeft: 4 }}>vs last month</Text>
              </View>
            </Card>
          ))}
        </View>

        {activeTab === 'overview' && (
          <View style={styles.section}>
             <Card style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text variant="h3">Revenue Growth</Text>
                  <TouchableOpacity>
                     <MoreHorizontal size={20} color={COLORS.light.textSecondary} />
                  </TouchableOpacity>
                </View>
                
                {/* Mock Chart Visual */}
                <View style={styles.mockChart}>
                  {DATA_METRICS.chartData.map((d, i) => (
                    <View key={i} style={styles.chartColumn}>
                      <View style={[styles.chartBar, { height: `${d.value}%` }]} />
                      <Text variant="caption" color={COLORS.light.textSecondary} style={styles.chartLabel}>{d.label}</Text>
                    </View>
                  ))}
                  {/* Chart Line Mock */}
                   <View style={styles.chartLine} />
                </View>
             </Card>
          </View>
        )}

        {activeTab === 'table' && (
           <View style={styles.section}>
             <Card padding="none" style={styles.tableCard}>
                <View style={styles.tableHeaderRow}>
                   <Text variant="captionBold" style={[styles.col, { flex: 2 }]}>PROJECT</Text>
                   <Text variant="captionBold" style={[styles.col, { flex: 1 }]}>STATUS</Text>
                   <Text variant="captionBold" style={[styles.col, { flex: 1, textAlign: 'right' }]}>BUDGET</Text>
                </View>
                {DATA_METRICS.table.map((row, index) => (
                   <TouchableOpacity 
                    key={row.id} 
                    style={[styles.tableRow, index !== DATA_METRICS.table.length - 1 && styles.borderBottom]}
                    onPress={() => router.push('/data-detail')}
                   >
                      <View style={[styles.col, { flex: 2 }]}>
                         <Text variant="bodyBold">{row.name}</Text>
                         <Text variant="caption" color={COLORS.light.textSecondary}>{row.date}</Text>
                      </View>
                      <View style={[styles.col, { flex: 1 }]}>
                         <StatusBadge status={row.status} />
                      </View>
                      <Text variant="bodyBold" style={[styles.col, { flex: 1, textAlign: 'right' }]}>{row.budget}</Text>
                   </TouchableOpacity>
                ))}
             </Card>
           </View>
        )}

         {activeTab === 'insights' && (
           <View style={styles.section}>
              {DATA_METRICS.insights.map((insight) => (
                 <Card key={insight.id} style={styles.insightCard}>
                    <View style={[styles.insightIcon, { backgroundColor: insight.type === 'positive' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)' }]}>
                       {insight.type === 'positive' ? (
                          <ArrowUpRight size={24} color={COLORS.success} />
                       ) : (
                          <ArrowDownRight size={24} color={COLORS.error} />
                       )}
                    </View>
                    <View style={styles.insightContent}>
                       <Text variant="h3">{insight.title}</Text>
                       <Text variant="body" color={COLORS.light.textSecondary}>{insight.description}</Text>
                    </View>
                 </Card>
              ))}
           </View>
        )}

      </ScrollView>
    </ScreenWrapper>
  );
}

const TabButton = ({ label, isActive, onPress }: { label: string, isActive: boolean, onPress: () => void }) => (
  <TouchableOpacity 
    style={[styles.tabButton, isActive && styles.activeTabButton]} 
    onPress={onPress}
  >
    <Text 
      variant="captionBold" 
      color={isActive ? COLORS.light.surface : COLORS.light.textSecondary}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const StatusBadge = ({ status }: { status: string }) => {
  let color: string = COLORS.light.textSecondary;
  let bg: string = COLORS.light.surfaceHighlight;

  if (status === 'Completed') { color = COLORS.success; bg = 'rgba(52, 199, 89, 0.1)'; }
  if (status === 'In Progress') { color = COLORS.primary; bg = 'rgba(0, 102, 255, 0.1)'; }
  if (status === 'Pending') { color = COLORS.warning; bg = 'rgba(255, 149, 0, 0.1)'; }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text variant="captionBold" color={color} style={{ fontSize: 10 }}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: SPACING.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downloadButton: {
    padding: SPACING.s,
    backgroundColor: 'rgba(0, 102, 255, 0.1)',
    borderRadius: RADIUS.m,
  },
  tabsContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.l,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.surface,
    padding: 4,
    borderRadius: RADIUS.l,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.m,
  },
  activeTabButton: {
    backgroundColor: COLORS.light.text,
  },
  content: {
    paddingBottom: 100,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  kpiCard: {
    width: '47%', // roughly half minus gap
  },
  kpiLabel: {
    marginBottom: SPACING.xs,
    fontSize: 10,
  },
  kpiValue: {
    marginBottom: SPACING.xs,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    marginLeft: 2,
  },
  section: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.l,
  },
  chartCard: {
    height: 300,
    justifyContent: 'space-between',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  mockChart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: SPACING.s,
    position: 'relative',
  },
  chartColumn: {
    alignItems: 'center',
    width: 30,
    height: '100%',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  chartBar: {
    width: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    marginBottom: SPACING.s,
  },
  chartLabel: {
    fontSize: 10,
  },
  chartLine: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    height: 100,
    borderTopWidth: 2,
    borderColor: 'rgba(0, 102, 255, 0.3)',
    transform: [{ rotate: '-10deg' }],
    zIndex: 1,
  },
  tableCard: {
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    padding: SPACING.m,
    backgroundColor: COLORS.light.surfaceHighlight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  col: {
    justifyContent: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: SPACING.m,
    alignItems: 'center',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.s,
    alignSelf: 'flex-start',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
    padding: SPACING.l,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.l,
  },
  insightContent: {
    flex: 1,
  },
});
