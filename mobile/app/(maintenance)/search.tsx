import React, { useState, useMemo } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { Text, TextInput } from 'react-native-paper';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

interface MaintenanceItem {
  id: string;
  title: string;
  type: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Scheduled' | 'In Progress' | 'Pending' | 'Completed';
  createdAt: string;
  assignee: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Scheduled: {
    bg: 'rgba(16,185,129,0.12)',
    color: '#10b981',
  },
  'In Progress': {
    bg: 'rgba(245,158,11,0.12)',
    color: '#f59e0b',
  },
  Pending: {
    bg: 'rgba(59,130,246,0.12)',
    color: '#3b82f6',
  },
  Completed: {
    bg: 'rgba(139,92,246,0.12)',
    color: '#8b5cf6',
  },
};

const PRIORITY = {
  Critical: '#ef4444',
  High: '#f59e0b',
  Medium: '#3b82f6',
  Low: '#10b981',
};

const FILTERS = [
  'All',
  'Scheduled',
  'In Progress',
  'Pending',
  'Completed',
];

const MOCK_MAINTENANCE: MaintenanceItem[] = [
  {
    id: 'MN-001',
    title: 'Gearbox Oil Change',
    type: 'Preventive',
    priority: 'High',
    status: 'Scheduled',
    createdAt: '2026-05-18',
    assignee: 'John Smith',
  },
  {
    id: 'MN-002',
    title: 'Blade Inspection',
    type: 'Predictive',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-05-17',
    assignee: 'Jane Doe',
  },
  {
    id: 'MN-003',
    title: 'Bearing Replacement',
    type: 'Corrective',
    priority: 'Critical',
    status: 'Pending',
    createdAt: '2026-05-16',
    assignee: 'Mike Johnson',
  },
  {
    id: 'MN-004',
    title: 'Yaw System Check',
    type: 'Preventive',
    priority: 'Low',
    status: 'Completed',
    createdAt: '2026-05-15',
    assignee: 'Sarah Wilson',
  },
  {
    id: 'MN-005',
    title: 'Generator Service',
    type: 'Preventive',
    priority: 'Medium',
    status: 'Scheduled',
    createdAt: '2026-05-18',
    assignee: 'Tom Brown',
  },
  {
    id: 'MN-006',
    title: 'Hydraulic System',
    type: 'Emergency',
    priority: 'Critical',
    status: 'In Progress',
    createdAt: '2026-05-17',
    assignee: 'Emily Davis',
  },
  {
    id: 'MN-007',
    title: 'Pitch System Repair',
    type: 'Corrective',
    priority: 'High',
    status: 'Pending',
    createdAt: '2026-05-16',
    assignee: 'Chris Lee',
  },
  {
    id: 'MN-008',
    title: 'Transformer Check',
    type: 'Predictive',
    priority: 'Low',
    status: 'Completed',
    createdAt: '2026-05-15',
    assignee: 'Anna Taylor',
  },
];

export default function SearchTicketScreen() {
  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let data = MOCK_MAINTENANCE;

    if (statusFilter !== 'All') {
      data = data.filter(
        (t) => t.status === statusFilter
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      data = data.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    return data;
  }, [search, statusFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) =>
      prev === id ? null : id
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#064e3b', '#065f46']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIcon, { backgroundColor: '#10b981' }]}>
              <Ionicons name="search" size={20} color="#fff" />
            </View>
            <View>
              <Text variant='titleMedium' style={styles.headerTitle}>Search Maintenance</Text>
              <Text variant='labelSmall' style={styles.headerSubtitle}>{filteredItems.length} active tasks</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="filter-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94a3b8" />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by title or task ID..."
          placeholderTextColor="#64748b"
          style={styles.searchInput}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          textColor="#fff"
          mode="flat"
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* FILTERS */}

      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChips}
        >
          {FILTERS.map((filter) => {
            const active =
              statusFilter === filter;

            const chipColors = active
              ? filter === 'Scheduled'
                ? ['#10b981', '#059669'] as const
                : filter === 'In Progress'
                  ? (['#f59e0b', '#d97706'] as const)
                  : filter === 'Pending'
                    ? (['#3b82f6', '#2563eb'] as const)
                    : filter === 'Completed'
                      ? (['#8b5cf6', '#7c3aed'] as const)
                      : (['#10b981', '#059669'] as const)
              : ['transparent', 'transparent'] as const;

            return (
              <TouchableOpacity
                key={filter}
                activeOpacity={0.9}
                onPress={() => setStatusFilter(filter)}
                style={styles.filterChip}
              >
                <LinearGradient
                  colors={chipColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.chipContent}>
                  <Text style={active ? styles.filterChipTextActive : styles.filterChipText}>
                    {filter}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* LIST */}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 140,
        }}
        renderItem={({ item }) => {
          const expanded =
            expandedId === item.id;

          const status =
            STATUS_COLORS[item.status];

          const priorityColor =
            PRIORITY[item.priority];

          return (
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() =>
                toggleExpand(item.id)
              }
              style={[
                styles.card,
                expanded &&
                styles.cardExpanded,
              ]}
            >
              {/* CARD TOP */}

              <View style={styles.cardTop}>
                <View style={styles.ticketIdBox}>
                  <Text
                    style={styles.ticketId}
                  >
                    {item.id}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        status.bg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          status.color,
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* TITLE */}

              <Text style={styles.ticketTitle}>
                {item.title}
              </Text>

              {/* META */}

              <View style={styles.metaRow}>
                <MetaItem
                  icon="person"
                  text={item.assignee}
                />

                <MetaItem
                  icon="calendar"
                  text={item.createdAt}
                />
              </View>

              {/* EXPANDED */}

              {expanded && (
                <View style={styles.expanded}>
                  <View
                    style={styles.divider}
                  />

                  <View style={styles.infoRow}>
                    <View>
                      <Text
                        style={
                          styles.smallLabel
                        }
                      >
                        Maintenance Type
                      </Text>

                      <Text
                        style={styles.infoValue}
                      >
                        {item.type}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={
                          styles.smallLabel
                        }
                      >
                        Priority
                      </Text>

                      <View
                        style={[
                          styles.priorityPill,
                          {
                            backgroundColor:
                              priorityColor +
                              '20',
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.priorityDot,
                            {
                              backgroundColor:
                                priorityColor,
                            },
                          ]}
                        />

                        <Text
                          style={[
                            styles.priorityText,
                            {
                              color:
                                priorityColor,
                            },
                          ]}
                        >
                          {item.priority}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* ACTIONS */}

                  <View
                    style={styles.actions}
                  >
                    <TouchableOpacity
                      style={styles.actionBtn}
                    >
                      <Ionicons
                        name="eye"
                        size={18}
                        color="#3b82f6"
                      />

                      <Text
                        style={
                          styles.actionText
                        }
                      >
                        View Details
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        styles.noteBtn,
                      ]}
                    >
                      <Ionicons
                        name="chatbubble"
                        size={18}
                        color="#10b981"
                      />

                      <Text
                        style={[
                          styles.actionText,
                          {
                            color:
                              '#10b981',
                          },
                        ]}
                      >
                        Add Note
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* EXPAND */}

              <View style={styles.expandBox}>
                <Ionicons
                  name={
                    expanded
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={18}
                  color="#64748b"
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

/* META ITEM */

const MetaItem = ({
  icon,
  text,
}: {
  icon: any;
  text: string;
}) => (
  <View style={styles.metaItem}>
    <Ionicons
      name={icon}
      size={13}
      color="#64748b"
    />

    <Text style={styles.metaText}>
      {text}
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
  notificationBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.15)',
    gap: 6,
  },

  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 12,
    height: 20,
  },

  /* FILTERS */

  filterSection: { margin: 10 },
  filterChips: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.15)',
    gap: 6,
  },
  filterChipText: { color: '#a78bfa', fontSize: 12, fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* CARDS */

  card: {
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.15)',
  },

  cardExpanded: { borderColor: '#a78bfa' },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ticketIdBox: {
    backgroundColor:
      'rgba(139,92,246,0.14)',

    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  ticketId: {
    color: '#8b5cf6',
    fontWeight: '700',
    fontSize: 11,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  ticketTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 14,
    lineHeight: 22,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    gap: 14,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  metaText: {
    color: '#94a3b8',
    fontSize: 12,
  },

  expanded: {
    marginTop: 16,
  },

  divider: {
    height: 1,
    backgroundColor:
      'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  smallLabel: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  infoValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 2,
  },

  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 10,
  },

  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },

  actions: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 12,
  },

  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 12,
    borderRadius: 14,

    backgroundColor:
      'rgba(59,130,246,0.12)',

    gap: 8,
  },

  noteBtn: {
    backgroundColor:
      'rgba(16,185,129,0.12)',
  },

  actionText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '700',
  },

  expandBox: {
    alignItems: 'center',
    marginTop: 12,
  },
});
