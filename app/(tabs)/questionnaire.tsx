import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebase/firebaseConfig';

const screenWidth = Dimensions.get('window').width;
const isLargeScreen = screenWidth >= 768;

export default function Questionnaire() {
  const { user } = useAuth();
  const [skinType, setSkinType] = useState('');
  const [budget, setBudget] = useState('');
  const [concern, setConcern] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const testFirebaseConnection = async () => {
    try {
      console.log('Testing Firebase connection...');
      const testDoc = doc(db, 'test', 'connection-test');
      await setDoc(testDoc, { test: true, timestamp: new Date().toISOString() });
      console.log('Firebase connection test successful');
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    console.log('Submit button pressed');
    console.log('User:', user);
    console.log('Skin Type:', skinType);
    console.log('Concern:', concern);
    console.log('Budget:', budget);

    if (!user) {
      setIsSubmitting(false);
      Alert.alert('Error', 'You must be logged in to submit your skin profile. Please log in or sign up.');
      return;
    }

    if (!skinType || !concern || !budget) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Test Firebase connection first
      const connectionTest = await testFirebaseConnection();
      if (!connectionTest) {
        throw new Error('Firebase connection failed');
      }

      console.log('Saving data to Firestore...');
      const dataToSave = {
        skinType,
        budget,
        concern,
        timestamp: new Date().toISOString(),
      };
      console.log('Data to save:', dataToSave);

      // Save data to Firestore
      await setDoc(doc(db, 'responses', user.uid), dataToSave);
      console.log('Data saved successfully');

      // Navigate to recommendation screen immediately
      router.push('/(tabs)/recommendation');

      // Show success message (optional)
      Alert.alert(
        'Success!',
        'Your skin profile has been saved. Generating your personalized recommendations...'
      );
    } catch (error) {
      console.error('Error saving questionnaire data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to save your responses: ${errorMessage}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Know Your Skin</Text>

        <Text style={styles.label}>Skin Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={skinType}
            onValueChange={setSkinType}
            style={styles.picker}
          >
            <Picker.Item label="Select Skin Type" value="" />
            <Picker.Item label="Oily" value="oily" />
            <Picker.Item label="Dry" value="dry" />
            <Picker.Item label="Combination" value="combination" />
          </Picker>
        </View>

        <Text style={styles.label}>Primary Skin Concern</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={concern}
            onValueChange={setConcern}
            style={styles.picker}
          >
            <Picker.Item label="Select Concern" value="" />
            <Picker.Item label="Acne" value="acne" />
            <Picker.Item label="Hyperpigmentation" value="hyperpigmentation" />
            <Picker.Item label="Wrinkles" value="wrinkles" />
          </Picker>
        </View>

        <Text style={styles.label}>Budget</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={budget}
            onValueChange={setBudget}
            style={styles.picker}
          >
            <Picker.Item label="Select Budget" value="" />
            <Picker.Item label="Below Rs. 500" value="below500" />
            <Picker.Item label="Rs. 500 - 1000" value="500to1000" />
            <Picker.Item label="Rs. 1000 - 2000" value="1000to2000" />
          </Picker>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!skinType || !concern || !budget || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!skinType || !concern || !budget || isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.submitButtonText,
              (!skinType || !concern || !budget || isSubmitting) && styles.submitButtonTextDisabled
            ]}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F3EC',
    padding: 24,
  },
  wrapper: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: isLargeScreen ? 36 : 32,
    fontWeight: 'bold',
    color: '#4A776D',
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: isLargeScreen ? 22 : 20,
    marginTop: 16,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: '#4A776D',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  picker: {
    fontSize: isLargeScreen ? 20 : 18,
    height: 60,
    width: '100%',
    color: '#333',
    fontWeight: '500',
  },
  buttonWrapper: {
    marginTop: 32,
  },
  submitButton: {
    backgroundColor: '#4A776D',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: isLargeScreen ? 22 : 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
});
