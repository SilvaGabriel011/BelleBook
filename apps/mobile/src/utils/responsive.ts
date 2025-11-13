import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { isWeb, getDeviceType } from './platform';

// Extend React Native styles for web
type ExtendedViewStyle = ViewStyle & {
  cursor?: string;
  transition?: string;
  boxShadow?: string;
  marginHorizontal?: 'auto' | number;
};

// Base font sizes for different screen sizes
const baseFontSizes = {
  mobile: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  tablet: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 42,
  },
  desktop: {
    xs: 14,
    sm: 16,
    base: 18,
    lg: 20,
    xl: 28,
    '2xl': 36,
    '3xl': 42,
    '4xl': 48,
  },
};

// Get responsive font size
export const fontSize = (size: keyof typeof baseFontSizes.mobile) => {
  const deviceType = getDeviceType();
  return baseFontSizes[deviceType][size];
};

// Base spacing values
const baseSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Get responsive spacing
export const spacing = (size: keyof typeof baseSpacing) => {
  const multiplier = getDeviceType() === 'desktop' ? 1.2 : 1;
  return baseSpacing[size] * multiplier;
};

// Common responsive styles
export const responsiveStyles = StyleSheet.create<{
  [key: string]: ViewStyle | TextStyle | ImageStyle;
}>({
  container: {
    flex: 1,
    ...(isWeb && {
      maxWidth: 1200,
      marginHorizontal: 'auto' as 'auto',
      width: '100%',
    } as ExtendedViewStyle),
  },
  contentContainer: {
    paddingHorizontal: spacing('md'),
    paddingVertical: spacing('lg'),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing('md'),
    ...(isWeb && {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    } as ExtendedViewStyle),
    ...(!isWeb && {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  button: {
    paddingVertical: spacing('sm') + 4,
    paddingHorizontal: spacing('lg'),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...(isWeb && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } as ExtendedViewStyle),
  },
  primaryButton: {
    backgroundColor: '#8B5CF6',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  buttonText: {
    fontSize: fontSize('lg'),
    fontWeight: '600',
  },
  title: {
    fontSize: fontSize('3xl'),
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: fontSize('xl'),
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: fontSize('2xl'),
    fontWeight: '600',
    color: '#111827',
    marginBottom: spacing('md'),
  },
  text: {
    fontSize: fontSize('base'),
    color: '#374151',
  },
  webScrollView: {
    ...(isWeb && {
      height: '100vh' as any,
      overflow: 'auto' as any,
    }),
  },
});

// Grid system for web
export const grid = {
  container: {
    ...(isWeb && {
      display: 'flex' as any,
      flexWrap: 'wrap' as any,
      marginHorizontal: -spacing('sm'),
    }),
  },
  col: (columns: number = 12, span: number = 12) => ({
    ...(isWeb && {
      flex: `0 0 ${(span / columns) * 100}%`,
      maxWidth: `${(span / columns) * 100}%`,
      paddingHorizontal: spacing('sm'),
    }),
    ...(!isWeb && {
      flex: 1,
    }),
  }),
};
