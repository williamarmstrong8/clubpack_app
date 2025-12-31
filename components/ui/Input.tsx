import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  containerStyle,
  icon,
  style,
  ...props
}: InputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="captionBold" color={COLORS.light.textSecondary} style={styles.label}>
          {label}
        </Text>
      )}
      <View style={[styles.inputWrapper, error ? styles.errorBorder : null]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.light.textSecondary}
          selectionColor={COLORS.primary}
          {...props}
        />
      </View>
      {error && (
        <Text variant="caption" color={COLORS.error} style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.l,
  },
  label: {
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light.surface,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.m,
    height: 48,
    paddingHorizontal: SPACING.m,
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.light.text,
    fontSize: 16,
  },
  iconContainer: {
    marginRight: SPACING.s,
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  errorText: {
    marginTop: SPACING.xs,
  },
});
