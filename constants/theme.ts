export const COLORS = {
  primary: '#0066FF', // Premium Blue
  primaryDark: '#0052CC',
  secondary: '#6E6E73',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  // Dark mode
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    surfaceHighlight: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
  },
  
  // Light mode
  light: {
    background: '#F2F2F7',
    surface: '#FFFFFF',
    surfaceHighlight: '#F9F9F9',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
  }
} as const;

export const SPACING = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  none: 0,
} as const;

export const RADIUS = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  round: 999,
} as const;

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  captionBold: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
};
