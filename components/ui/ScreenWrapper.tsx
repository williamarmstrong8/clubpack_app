import React from 'react';
import { View, StyleSheet, ViewStyle, SafeAreaView, StatusBar } from 'react-native';
import { COLORS } from '@/constants/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  safeArea?: boolean;
  statusBarStyle?: 'dark-content' | 'light-content';
}

export const ScreenWrapper = ({
  children,
  style,
  backgroundColor = COLORS.light.background,
  safeArea = true,
  statusBarStyle = 'dark-content',
}: ScreenWrapperProps) => {
  
  const Content = (
    <View style={[styles.container, { backgroundColor }, style]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      {children}
    </View>
  );

  if (safeArea) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        {Content}
      </SafeAreaView>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
