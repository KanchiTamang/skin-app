import { useRouter } from 'expo-router';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const isLargeScreen = screenWidth >= 768;

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.wrapper}>
        <Text style={styles.heading}>Welcome to SkinPal</Text>
        <Text style={styles.subheading}>Get started with your skin analysis.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)/questionnaire')} // ✅ Corrected path
        >
          <Text style={styles.buttonText}>Start Skin Analysis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F3EC',
    padding: 20,
  },
  wrapper: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: isLargeScreen ? 42 : 36,
    fontWeight: 'bold',
    color: '#4A776D',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontSize: isLargeScreen ? 32 : 26,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4A776D',
    paddingVertical: isLargeScreen ? 23 : 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: isLargeScreen ? 23 : 21,
    fontWeight: '600',
  },
});
