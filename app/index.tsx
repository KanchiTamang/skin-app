import React from 'react';
import { AuthProvider, useAuth } from '../context/authContext';
import Tabs from './(tabs)';
import LoginScreen from './login';

const Main = () => {
  const { user } = useAuth();
  return user ? <Tabs /> : <LoginScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}