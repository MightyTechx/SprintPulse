import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme';
import { turbMockTurbines, STATUS_CONFIG } from '../../src/utils/mockData';
import type { Turbine, TurbineStatus } from '../../src/types';

const STATUS_PRIORITY_ORDER: TurbineStatus[] = ['fault', 'stopped', 'maintenance', 'running'];
const ACCENT = '#10b981';

const getStatusIcon = (status: TurbineStatus) => {
  switch (status) {
    case 'fault': return 'warning';
    case 'stopped': return 'stop';
    case 'maintenance': return 'construct';
    case 'running': return 'play';
    default: return 'ellipse';
  }
};

const getStatusChipColor = (status: TurbineStatus) => {
  switch (status) {
    case 'fault': return { color: '#ef4444' };
    case 'stopped': return { color: '#94a3b8' };
    case 'maintenance': return { color: '#f59e0b' };
    case 'running': return { color: '#10b981' };
    default: return { color: '#10b981' };
  }
};

export default function DashboardScreen() {
  const router = useRouter();
  const [turbineData] = useState<Turbine[]>(turbMockTurbines);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TurbineStatus | null>(null);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHours(String(now.getHours()).padStart(2, '0'));
      setMinutes(String(now.getMinutes()).padStart(2, '0'));
      setSeconds(String(now.getSeconds()).padStart(2, '0'));
      setDateStr(now.toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }));
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  const filteredTurbines = useMemo(() => {
    let result = turbineData;
    if (statusFilter) result = result.filter((t) => t.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.turbineNo.toLowerCase().includes(q) || t.status.toLowerCase().includes(q));
    }
    return result;
  }, [turbineData, search, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    STATUS_PRIORITY_ORDER.forEach((status) => {
      counts[status] = turbineData.filter((t) => t.status === status).length;
    });
    return counts;
  }, [turbineData]);

  const totalPower = filteredTurbines.filter((t) => t.status === 'running').reduce((s, t) => s + t.powerOutput, 0);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#064e3b', '#065f46']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIcon, { backgroundColor: ACCENT }]}>
              <Ionicons name="grid" size={20} color="#fff" />
            </View>
            <View>
              <Text variant='titleMedium' style={styles.headerTitle}>Dashboard</Text>
              <Text variant='labelSmall' style={styles.headerSubtitle}>{filteredTurbines.length} Turbines - Wind Tree Farm</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            {statusCounts.fault > 0 && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Clock Widget */}
        <View style={styles.clockCard}>
          <View style={styles.clockRow}>
            <Text style={styles.clockTime}>{hours}:{minutes}</Text>
            <Text style={styles.clockSeconds}>{seconds}</Text>
          </View>
          <Text variant='bodySmall' style={styles.clockDate}>{dateStr}</Text>
        </View>

        {/* Live Stats */}
        <View style={styles.statsRow}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text variant='labelMedium' style={styles.liveText}>Live</Text>
          </View>
          <View style={styles.powerBadge}>
            <Ionicons name="flash" size={14} color={ACCENT} />
            <Text variant='labelMedium' style={styles.powerText}>{totalPower.toFixed(0)} kW</Text>
          </View>
        </View>

        {/* Status Filter Chips - Horizontal Scroll */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
            <TouchableOpacity
              style={[styles.filterChip, !statusFilter && styles.filterChipActive]}
              onPress={() => setStatusFilter(null)}
            >
              <Ionicons name="apps" size={14} color={!statusFilter ? '#fff' : colors.text.muted} />
              <Text style={[styles.filterChipText, !statusFilter && styles.filterChipTextActive]}>All ({turbineData.length})</Text>
            </TouchableOpacity>
            {STATUS_PRIORITY_ORDER.map((status) => {
              const cfg = getStatusChipColor(status);
              const isActive = statusFilter === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.filterChip, isActive && { backgroundColor: cfg.color }]}
                  onPress={() => setStatusFilter(isActive ? null : status)}
                >
                  <Ionicons name={getStatusIcon(status) as any} size={14} color={isActive ? '#fff' : cfg.color} />
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search turbines..."
            placeholderTextColor={colors.text.muted}
            value={search}
            onChangeText={setSearch}
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.text.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Turbine Grid */}
        <View style={styles.matrixCard}>
          {STATUS_PRIORITY_ORDER.map((groupStatus) => {
            const groupTurbines = filteredTurbines.filter((t) => t.status === groupStatus);
            if (groupTurbines.length === 0) return null;
            const groupCfg = STATUS_CONFIG[groupStatus];

            return (
              <View key={groupStatus} style={styles.siteGroup}>
                <View style={styles.siteHeader}>
                  <View style={styles.siteHeaderLeft}>
                    <View style={[styles.statusDot, { backgroundColor: groupCfg.color }]} />
                    <Text variant='titleMedium' style={styles.siteTitle}>
                      {groupStatus.charAt(0).toUpperCase() + groupStatus.slice(1)}
                    </Text>
                    <View style={styles.countBadge}>
                      <Text variant='labelSmall' style={styles.countBadgeText}>{groupTurbines.length}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.turbineGrid}>
                  {groupTurbines.map((turbine) => {
                    const cfg = STATUS_CONFIG[turbine.status];
                    return (
                      <TouchableOpacity key={turbine.id} style={[styles.turbineTile, { backgroundColor: cfg.bgColor, borderColor: cfg.borderColor }]} activeOpacity={0.8} onPress={() => router.push(`/turbine-detail?id=${turbine.id}`)}>
                        <View style={[styles.tileStatusBar, { backgroundColor: cfg.color }]} />
                        <View style={styles.tileHeader}>
                          <View style={[styles.tileDot, { backgroundColor: cfg.color }]} />
                          <Text variant='labelMedium' style={styles.tileName}>{turbine.turbineNo}</Text>
                        </View>
                        <View style={styles.tileStatusRow}>
                          <Ionicons name={getStatusIcon(turbine.status) as any} size={10} color={cfg.color} />
                          <Text variant='labelSmall' style={[styles.tileStatus, { color: cfg.color }]}>{cfg.label}</Text>
                        </View>
                        <Text variant='labelSmall' style={styles.tilePower}>{turbine.powerOutput.toFixed(1)} kW</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {filteredTurbines.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={colors.text.muted} />
              <Text variant='bodyLarge' style={styles.emptyText}>No turbines found</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerTitle: { color: '#fff', fontWeight: '600', fontSize: 16 },
  headerSubtitle: { color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: 11, marginTop: 2 },
  notificationBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  clockCard: { alignItems: 'center', marginBottom: 16, backgroundColor: colors.background.surface, paddingVertical: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)' },
  clockRow: { flexDirection: 'row', alignItems: 'flex-start' },
  clockTime: { fontSize: 44, fontWeight: '700', color: '#fff', letterSpacing: 2 },
  clockSeconds: { fontSize: 18, fontWeight: '500', color: '#a78bfa', marginTop: 10, marginLeft: 6 },
  clockDate: { color: colors.text.secondary, marginTop: 8, fontSize: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16, gap: 12 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.15)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT, marginRight: 6 },
  liveText: { color: ACCENT, fontWeight: '700', fontSize: 12 },
  powerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(167,139,250,0.15)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(167,139,250,0.3)', gap: 6 },
  powerText: { color: '#a78bfa', fontWeight: '700', fontSize: 12 },
  filterSection: { marginBottom: 16 },
  filterChips: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.surface, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(16,185,129,0.15)', gap: 6 },
  filterChipActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  filterChipText: { color: colors.text.secondary, fontSize: 12, fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)', marginBottom: 16, gap: 6 },
  searchInput: { flex: 1, backgroundColor: 'transparent', fontSize: 12, color: colors.text.primary, height: 20 },
  matrixCard: { backgroundColor: colors.background.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)' },
  siteGroup: { marginBottom: 20 },
  siteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.15)', marginBottom: 12 },
  siteHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  siteTitle: { color: '#fff', fontWeight: '700', fontSize: 14 },
  countBadge: { backgroundColor: 'rgba(167,139,250,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginLeft: 10 },
  countBadgeText: { color: '#a78bfa', fontWeight: '700', fontSize: 11 },
  turbineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  turbineTile: { width: '31%', padding: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  tileStatusBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  tileHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 6 },
  tileDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  tileName: { color: '#fff', fontWeight: '700', fontSize: 11 },
  tileStatusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 4 },
  tileStatus: { fontSize: 9, fontWeight: '600' },
  tilePower: { color: colors.text.muted, fontSize: 10, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: colors.text.muted, marginTop: 12 },
});