import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { COLORS } from '@/constants/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.light.background },
            animation: 'fade',
          }}
        >
          {/* Landing & Auth */}
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="login" options={{ animation: 'slide_from_right', presentation: 'card' }} />
          <Stack.Screen name="signup" options={{ animation: 'slide_from_right', presentation: 'card' }} />
          
          {/* Main App */}
          <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
          
          {/* Modals & Details */}
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }} 
          />
          <Stack.Screen 
            name="notifications" 
            options={{ 
              headerShown: true,
              title: 'Notifications',
              headerBackTitle: 'Back',
              presentation: 'card',
              animation: 'slide_from_right'
            }} 
          />
           <Stack.Screen 
            name="item-detail" 
            options={{ 
              headerShown: true,
              title: 'Details',
              headerBackTitle: 'Back',
              presentation: 'card',
              animation: 'slide_from_right'
            }} 
          />
           <Stack.Screen 
            name="feature-detail" 
            options={{ 
              headerShown: true,
              title: 'Feature Preview',
              headerBackTitle: 'Back',
              presentation: 'card',
              animation: 'slide_from_right'
            }} 
          />
           <Stack.Screen 
            name="data-detail" 
            options={{ 
              headerShown: true,
              title: 'Data Insights',
              headerBackTitle: 'Back',
              presentation: 'card',
              animation: 'slide_from_right'
            }} 
          />
           <Stack.Screen 
            name="edit-profile" 
            options={{ 
              headerShown: true,
              title: 'Edit Profile',
              headerBackTitle: 'Back',
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }} 
          />
           <Stack.Screen 
            name="settings" 
            options={{ 
              headerShown: true,
              title: 'Settings',
              headerBackTitle: 'Back',
              presentation: 'card',
              animation: 'slide_from_right'
            }} 
          />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
