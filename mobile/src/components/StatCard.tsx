import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function StatCard({
  title,
  value,
  icon,
  color = colors.card.info,
  trend,
  trendValue,
  onPress,
  style,
}: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'arrow-up';
      case 'down':
        return 'arrow-down';
      default:
        return 'remove';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return colors.card.success;
      case 'down':
        return colors.card.danger;
      default:
        return colors.text.muted;
    }
  };

  const content = (
    <Surface style={[styles.card, style]} elevation={2}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.content}>
        <Text variant='bodySmall' style={styles.title}>
          {title}
        </Text>
        <Text variant='headlineMedium' style={styles.value}>
          {value}
        </Text>
        {trend && trendValue && (
          <View style={styles.trendContainer}>
            <Ionicons name={getTrendIcon()} size={14} color={getTrendColor()} />
            <Text variant='labelSmall' style={[styles.trendText, { color: getTrendColor() }]}>
              {trendValue}
            </Text>
          </View>
        )}
      </View>
    </Surface>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#1A2D47',
    flex: 1,
    minWidth: 150,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.text.secondary,
    marginBottom: 4,
  },
  value: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendText: {
    marginLeft: 4,
  },
});
