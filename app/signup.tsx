import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';

const screenWidth = Dimensions.get('window').width;
const isLargeScreen = screenWidth >= 768;

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        firstName,
        lastName,
        phoneNumber,
        email,
      });
      router.replace('/(tabs)/home');
    } catch (err) {
      alert('Signup Failed');
      console.error(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput placeholder="First Name" style={styles.input} value={firstName} onChangeText={setFirstName} />
        <TextInput placeholder="Last Name" style={styles.input} value={lastName} onChangeText={setLastName} />
        <TextInput placeholder="Phone Number" style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />

        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.linkText}>
          Already have an account?
          <Text onPress={() => router.push('/login')} style={styles.link}> Login</Text>
        </Text>
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
  formWrapper: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: isLargeScreen ? 28 : 22,
    fontWeight: '700',
    color: '#4A776D',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: isLargeScreen ? 16 : 12,
    fontSize: isLargeScreen ? 18 : 14,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4A776D',
    padding: isLargeScreen ? 18 : 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: isLargeScreen ? 18 : 16,
    fontWeight: '600',
  },
  linkText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: isLargeScreen ? 16 : 14,
  },
  link: {
    color: '#4A776D',
    fontWeight: '600',
  },
});
