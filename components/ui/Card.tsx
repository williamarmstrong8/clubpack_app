import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: keyof typeof SPACING;
}

export const Card = ({
  children,
  style,
  onPress,
  variant = 'elevated',
  padding = 'l',
}: CardProps) => {
  
  const getStyle = () => {
    switch (variant) {
      case 'elevated':
        return styles.elevated;
      case 'outlined':
        return styles.outlined;
      case 'flat':
        return styles.flat;
      default:
        return styles.elevated;
    }
  };

  const Content = (
    <View style={[styles.content, { padding: SPACING[padding] }]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={[styles.container, getStyle(), style]}
      >
        {Content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, getStyle(), style]}>
      {Content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.l,
    overflow: 'hidden',
    backgroundColor: COLORS.light.surface,
  },
  content: {
    // Padding handled by prop
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.light.border,
    backgroundColor: 'transparent',
  },
  flat: {
    backgroundColor: COLORS.light.surfaceHighlight,
  },
});
