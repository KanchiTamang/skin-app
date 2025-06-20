// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/authContext';

function RootLayoutInner() {
  const { user, authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';
    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, authLoading, segments, router]);

  if (authLoading) {
    console.log('Still loading authentication...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F3EC' }}>
        <ActivityIndicator size="large" color="#4A776D" />
        <Text style={{ marginTop: 16, color: '#4A776D', fontSize: 18, fontWeight: 'bold' }}>Checking authentication...</Text>
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
