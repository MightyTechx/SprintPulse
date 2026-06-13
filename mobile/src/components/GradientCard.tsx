import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'glass';
  borderColor?: string;
}

export function GradientCard({ children, style, variant = 'default', borderColor }: GradientCardProps) {
  const getCardStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          borderColor: borderColor || 'rgba(167, 139, 250, 0.3)',
          shadowColor: colors.shadow.purple,
        };
      case 'glass':
        return {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
        };
      default:
        return {
          borderColor: borderColor || 'rgba(167, 139, 250, 0.2)',
          shadowColor: colors.shadow.purple,
        };
    }
  };

  const cardStyles = getCardStyles();

  if (variant === 'glass') {
    return (
      <View style={[styles.card, styles.glassCard, cardStyles, style]}>
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['rgba(17, 24, 39, 0.9)', 'rgba(15, 23, 42, 0.95)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, cardStyles, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  glassCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    backdropFilter: 'blur(12px)',
  },
});