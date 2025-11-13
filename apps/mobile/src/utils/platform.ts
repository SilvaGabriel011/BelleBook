import { Platform, Dimensions } from 'react-native';

// Platform detection
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

// Screen dimensions
export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive breakpoints
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

// Get device type based on screen width
export const getDeviceType = () => {
  if (screenWidth < breakpoints.mobile) return 'mobile';
  if (screenWidth < breakpoints.tablet) return 'tablet';
  return 'desktop';
};

// Responsive sizing
export const responsiveSize = (mobile: number, tablet?: number, desktop?: number) => {
  const deviceType = getDeviceType();
  if (deviceType === 'desktop' && desktop) return desktop;
  if (deviceType === 'tablet' && tablet) return tablet;
  return mobile;
};

// Platform-specific styles
export const platformSelect = <T,>(options: {
  web?: T;
  ios?: T;
  android?: T;
  default?: T;
}): T | undefined => {
  if (isWeb && options.web !== undefined) return options.web;
  if (isIOS && options.ios !== undefined) return options.ios;
  if (isAndroid && options.android !== undefined) return options.android;
  return options.default;
};

// Web-specific utilities
export const webStyles = isWeb ? {
  maxWidth: '100%',
  cursor: 'pointer',
  userSelect: 'none' as const,
} : {};

// Container max width for web
export const getContainerMaxWidth = () => {
  if (!isWeb) return undefined;
  const deviceType = getDeviceType();
  switch (deviceType) {
    case 'desktop':
      return 1200;
    case 'tablet':
      return 900;
    default:
      return '100%';
  }
};
