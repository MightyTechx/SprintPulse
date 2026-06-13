import React from 'react';

import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Text } from 'react-native-paper';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'alert' | 'success';
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Critical Turbine Alert',
    message:
      'WTG-04 gearbox temperature exceeded safety threshold.',
    timestamp: '2026-05-18T10:30:00',
    read: false,
    type: 'alert',
  },

  {
    id: '2',
    title: 'Maintenance Completed',
    message:
      'WTG-07 yaw system calibration completed successfully.',
    timestamp: '2026-05-18T09:10:00',
    read: true,
    type: 'success',
  },

  {
    id: '3',
    title: 'Inspection Scheduled',
    message:
      'Blade inspection scheduled for WTG-03 tomorrow morning.',
    timestamp: '2026-05-17T16:40:00',
    read: false,
    type: 'info',
  },

  {
    id: '4',
    title: 'Hydraulic Pressure Warning',
    message:
      'Pressure fluctuation detected in hydraulic system.',
    timestamp: '2026-05-17T14:15:00',
    read: true,
    type: 'warning',
  },

  {
    id: '5',
    title: 'System Upgrade',
    message:
      'Control system software updated successfully.',
    timestamp: '2026-05-16T11:20:00',
    read: true,
    type: 'success',
  },
];

const TYPE_CONFIG = {
  info: {
    icon: 'information-circle',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.18)',
  },

  warning: {
    icon: 'warning',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.18)',
  },

  alert: {
    icon: 'alert-circle',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.18)',
  },

  success: {
    icon: 'checkmark-circle',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.18)',
  },
};

export default function NotificationsScreen() {
  const [notifications] = React.useState(mockNotifications);
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const alertCount = notifications.filter((n) => n.type === 'alert').length;
  const successCount = notifications.filter((n) => n.type === 'success').length;

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const config = TYPE_CONFIG[item.type];

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        style={[
          styles.card,
          !item.read && styles.unreadCard,
        ]}
      >
        {/* Glow Background */}

        <LinearGradient
          colors={
            [
              'rgba(255,255,255,0.02)',
              'rgba(255,255,255,0.01)',
            ] as const
          }
          style={StyleSheet.absoluteFillObject}
        />

        {/* TOP */}

        <View style={styles.topRow}>
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor:
                  config.glow,
              },
            ]}
          >
            <Ionicons
              name={config.icon as any}
              size={22}
              color={config.color}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                {item.title}
              </Text>

              {!item.read && (
                <View
                  style={[
                    styles.liveDot,
                    {
                      backgroundColor:
                        config.color,
                    },
                  ]}
                />
              )}
            </View>

            <Text style={styles.message}>
              {item.message}
            </Text>
          </View>
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <View style={styles.timeRow}>
            <Ionicons
              name="time-outline"
              size={13}
              color="#64748b"
            />

            <Text style={styles.time}>
              {new Date(
                item.timestamp
              ).toLocaleString()}
            </Text>
          </View>

          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  config.glow,
              },
            ]}
          >
            <Text
              style={[
                styles.typeText,
                {
                  color: config.color,
                },
              ]}
            >
              {item.type.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#064e3b', '#065f46']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIcon, { backgroundColor: '#10b981' }]}>
              <Ionicons name="notifications" size={20} color="#fff" />
            </View>
            <View>
              <Text variant='titleMedium' style={styles.headerTitle}>Notifications</Text>
              <Text variant='labelSmall' style={styles.headerSubtitle}>Recent activity and updates</Text>
            </View>
          </View>
          <View style={styles.badgeWrap}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* FILTER CHIPS */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
          <TouchableOpacity
            style={[styles.filterChip, !typeFilter && styles.filterChipActive]}
            onPress={() => setTypeFilter(null)}
          >
            <Ionicons name="apps" size={14} color={!typeFilter ? '#fff' : '#10b981'} />
            <Text style={[styles.filterChipText, !typeFilter && styles.filterChipTextActive]}>All ({notifications.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, typeFilter === 'info' && styles.filterChipActive]}
            onPress={() => setTypeFilter(typeFilter === 'info' ? null : 'info')}
          >
            <Ionicons name="information-circle" size={14} color={typeFilter === 'info' ? '#fff' : '#3b82f6'} />
            <Text style={[styles.filterChipText, typeFilter === 'info' && styles.filterChipTextActive]}>Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, typeFilter === 'alert' && { backgroundColor: '#ef4444' }]}
            onPress={() => setTypeFilter(typeFilter === 'alert' ? null : 'alert')}
          >
            <Ionicons name="alert-circle" size={14} color={typeFilter === 'alert' ? '#fff' : '#ef4444'} />
            <Text style={[styles.filterChipText, typeFilter === 'alert' && styles.filterChipTextActive]}>Alerts ({alertCount})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, typeFilter === 'warning' && { backgroundColor: '#f59e0b' }]}
            onPress={() => setTypeFilter(typeFilter === 'warning' ? null : 'warning')}
          >
            <Ionicons name="warning" size={14} color={typeFilter === 'warning' ? '#fff' : '#f59e0b'} />
            <Text style={[styles.filterChipText, typeFilter === 'warning' && styles.filterChipTextActive]}>Warning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, typeFilter === 'success' && { backgroundColor: '#10b981' }]}
            onPress={() => setTypeFilter(typeFilter === 'success' ? null : 'success')}
          >
            <Ionicons name="checkmark-circle" size={14} color={typeFilter === 'success' ? '#fff' : '#10b981'} />
            <Text style={[styles.filterChipText, typeFilter === 'success' && styles.filterChipTextActive]}>Success ({successCount})</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* LIST */}

      <FlatList
        data={typeFilter ? notifications.filter(n => n.type === typeFilter) : notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom: 120,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons
              name="notifications-off"
              size={70}
              color="#475569"
            />

            <Text style={styles.emptyTitle}>
              No Notifications
            </Text>

            <Text style={styles.emptySub}>
              Everything is running smoothly
            </Text>
          </View>
        }
      />
    </View>
  );
}

/* STAT CARD */

const StatCard = ({
  title,
  value,
  icon,
  color,
}: any) => (
  <View style={styles.statCard}>
    <View
      style={[
        styles.statIcon,
        {
          backgroundColor:
            color + '20',
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={color}
      />
    </View>

    <Text style={styles.statValue}>
      {value}
    </Text>

    <Text style={styles.statTitle}>
      {title}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },

  header: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerTitle: { color: '#fff', fontWeight: '600', fontSize: 16 },
  headerSubtitle: { color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: 11, marginTop: 2 },
  badgeWrap: { width: 40, height: 40, borderRadius: 16, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  badge: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 18, fontWeight: '800' },

  filterSection: { margin: 10 },
  filterChips: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(15,23,42,0.95)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)', gap: 6 },
  filterChipActive: { backgroundColor: '#a78bfa', borderColor: '#a78bfa' },
  filterChipText: { color: '#a78bfa', fontSize: 12, fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },

  statCard: {
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.15)',
  },

  statIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 8 },
  statTitle: { color: '#94a3b8', marginTop: 4, fontSize: 11 },

  card: {
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.15)',
  },

  unreadCard: { borderColor: '#a78bfa' },
  topRow: { flexDirection: 'row' },
  iconWrap: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 },
  message: { color: '#94a3b8', marginTop: 6, lineHeight: 21, fontSize: 13 },
  liveDot: { width: 8, height: 8, borderRadius: 8, marginLeft: 8 },
  footer: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  time: { color: '#64748b', fontSize: 12 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  typeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySub: { color: '#64748b', marginTop: 8 },
});
