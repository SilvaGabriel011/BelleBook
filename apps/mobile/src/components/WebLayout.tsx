import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { isWeb, getContainerMaxWidth, getDeviceType } from '../utils/platform';
import { spacing } from '../utils/responsive';

interface WebLayoutProps {
  children: ReactNode;
  scrollable?: boolean;
  maxWidth?: number | string;
  noPadding?: boolean;
  backgroundColor?: string;
}

const WebLayout: React.FC<WebLayoutProps> = ({
  children,
  scrollable = true,
  maxWidth,
  noPadding = false,
  backgroundColor = '#F9FAFB',
}) => {
  const deviceType = getDeviceType();
  const containerMaxWidth = maxWidth || getContainerMaxWidth();

  const containerStyle = {
    ...styles.container,
    backgroundColor,
    ...(isWeb && {
      maxWidth: containerMaxWidth,
      marginHorizontal: 'auto' as const,
      width: '100%',
      ...(deviceType === 'desktop' && !noPadding && {
        paddingHorizontal: spacing('xl'),
      }),
      ...(deviceType === 'tablet' && !noPadding && {
        paddingHorizontal: spacing('lg'),
      }),
    }),
  };

  if (!scrollable) {
    return <View style={containerStyle}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={containerStyle}
      showsVerticalScrollIndicator={isWeb}
      showsHorizontalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    ...(isWeb && {
      height: '100vh' as any,
    }),
  },
});

export default WebLayout;
