import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/authContext';
import Tabs from './(tabs)';
import LoginScreen from './login';
import SignupScreen from './signup';

const Main = () => {
  const { user, authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F3EC' }}>
        <ActivityIndicator size="large" color="#4A776D" />
        <Text style={{ marginTop: 16, color: '#4A776D', fontSize: 18, fontWeight: 'bold' }}>Checking authentication...</Text>
      </View>
    );
  }

  // If not logged in, show login or signup based on route
  if (!user) {
    if (segments[0] === 'signup') {
      return <SignupScreen />;
    }
    return <LoginScreen />;
  }

  // If logged in, show main app
  return <Tabs />;
};

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

export function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}