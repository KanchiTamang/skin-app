import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebase/firebaseConfig';

export default function Recommendation() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!user) return;
      const docSnap = await getDoc(doc(db, 'responses', user.uid));
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
      setLoading(false);
    };
    fetchAnswers();
  }, [user]);

  const getRecommendation = () => {
    if (!data) return [];
    const { skinType, concern, budget } = data;

    // Fake product data (normally you'd fetch from Firestore or an API)
    const allProducts = [
      {
        id: 1,
        name: 'Hydrating Gel',
        skinType: 'dry',
        concern: 'wrinkles',
        budget: '500to1000',
        image: 'https://via.placeholder.com/100',
      },
      {
        id: 2,
        name: 'Acne Clear Foam',
        skinType: 'oily',
        concern: 'acne',
        budget: 'below500',
        image: 'https://via.placeholder.com/100',
      },
      {
        id: 3,
        name: 'Brightening Serum',
        skinType: 'combination',
        concern: 'hyperpigmentation',
        budget: '1000to2000',
        image: 'https://via.placeholder.com/100',
      },
    ];

    return allProducts.filter(
      (p) =>
        p.skinType === skinType &&
        p.concern === concern &&
        p.budget === budget
    );
  };

  if (loading) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  const results = getRecommendation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Recommended Products</Text>
      {results.length === 0 ? (
        <Text style={styles.noMatch}>No matching products found.</Text>
      ) : (
        results.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.productName}>{item.name}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A776D',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 12,
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
  },
  noMatch: {
    fontSize: 16,
    color: 'red',
  },
});
