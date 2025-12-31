import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';

interface ThemedTextProps extends TextProps {
  variant?: keyof typeof TYPOGRAPHY;
  color?: string;
  align?: TextStyle['textAlign'];
}

export const Text = ({ 
  style, 
  variant = 'body', 
  color = COLORS.light.text, 
  align = 'left',
  ...props 
}: ThemedTextProps) => {
  return (
    <RNText 
      style={[
        TYPOGRAPHY[variant], 
        { color, textAlign: align }, 
        style
      ]} 
      {...props} 
    />
  );
};
