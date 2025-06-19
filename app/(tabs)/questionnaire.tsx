import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
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
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user) return;
    await setDoc(doc(db, 'responses', user.uid), {
      skinType,
      budget,
      concern,
    });
    router.push('/(tabs)/recommendation'); // ✅ Correct path
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
          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={!skinType || !concern || !budget}
          />
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
    padding: 20,
  },
  wrapper: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: isLargeScreen ? 28 : 22,
    fontWeight: '700',
    color: '#4A776D',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    fontSize: isLargeScreen ? 18 : 16,
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    fontSize: isLargeScreen ? 18 : 14,
    height: 50,
    width: '100%',
  },
  buttonWrapper: {
    marginTop: 20,
  },
});
