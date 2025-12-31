import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { Text } from './Text';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  icon,
}: ButtonProps) => {
  
  const getBackgroundColor = () => {
    if (disabled) return COLORS.light.border;
    switch (variant) {
      case 'primary': return COLORS.primary;
      case 'secondary': return COLORS.light.surfaceHighlight;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      case 'danger': return COLORS.error;
      default: return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.light.textSecondary;
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return COLORS.light.text;
      case 'outline': return COLORS.primary;
      case 'ghost': return COLORS.primary;
      case 'danger': return '#FFFFFF';
      default: return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return disabled ? COLORS.light.border : COLORS.primary;
    return 'transparent';
  };

  const getHeight = () => {
    switch (size) {
      case 'small': return 36;
      case 'medium': return 48;
      case 'large': return 56;
      default: return 48;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          height: getHeight(),
          paddingHorizontal: size === 'small' ? SPACING.m : SPACING.l,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon}
          <Text 
            variant="bodyBold" 
            color={getTextColor()}
            style={{ marginLeft: icon ? SPACING.s : 0 }}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
