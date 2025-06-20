import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const isLargeScreen = screenWidth >= 768;

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(tabs)/questionnaire');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to</Text>
          <Text style={styles.appName}>Skin Pal App</Text>
          <Text style={styles.subtitle}>Your AI Skin Assistant</Text>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Discover your perfect skincare routine with personalized recommendations based on your unique skin type, concerns, and budget.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureTitle}>Personalized Recommendations</Text>
            <Text style={styles.featureDescription}>
              Get tailored product suggestions that match your skin type and concerns
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💡</Text>
            <Text style={styles.featureTitle}>Expert Tips</Text>
            <Text style={styles.featureDescription}>
              Learn proper application techniques and skincare best practices
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureTitle}>Budget-Friendly</Text>
            <Text style={styles.featureDescription}>
              Find effective products within your preferred price range
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EC',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: isLargeScreen ? 32 : 28,
    color: '#666',
    fontWeight: '400',
    marginBottom: 8,
  },
  appName: {
    fontSize: isLargeScreen ? 48 : 42,
    fontWeight: 'bold',
    color: '#4A776D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isLargeScreen ? 24 : 20,
    color: '#8A8E60',
    fontWeight: '600',
    textAlign: 'center',
  },
  descriptionSection: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: isLargeScreen ? 20 : 18,
    color: '#555',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400',
  },
  featuresSection: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featureIcon: {
    fontSize: isLargeScreen ? 48 : 40,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: isLargeScreen ? 22 : 20,
    fontWeight: 'bold',
    color: '#4A776D',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: isLargeScreen ? 16 : 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  getStartedButton: {
    backgroundColor: '#4A776D',
    paddingVertical: isLargeScreen ? 20 : 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: isLargeScreen ? 22 : 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
