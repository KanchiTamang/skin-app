import { useRouter } from 'expo-router';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebase/firebaseConfig';

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, 'responses', user.uid));
      if (snap.exists()) {
        setData(snap.data());
      }
    };
    fetchData();
  }, [user]);

  const handleReset = async () => {
    if (!user) return;
    await deleteDoc(doc(db, 'responses', user.uid));
    router.push('/(tabs)/questionnaire');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Skin Profile</Text>
      {data ? (
        <View style={styles.infoBox}>
          <Text>Skin Type: {data.skinType}</Text>
          <Text>Concern: {data.concern}</Text>
          <Text>Budget: {data.budget}</Text>
          <Button title="Update Answers" onPress={handleReset} />
        </View>
      ) : (
        <Text>No answers found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F3EC',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#4A776D',
  },
  infoBox: {
    gap: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
