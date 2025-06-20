import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    RefreshControl,
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

interface UserResponse {
  skinType: string;
  budget: string;
  concern: string;
}

interface Recommendation {
  category: string;
  products: string[];
  tips: string[];
}

export default function Recommendation() {
  const { user } = useAuth();
  const [userResponse, setUserResponse] = useState<UserResponse | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const fetchUserData = async () => {
    try {
      if (!user) {
        console.log('No user found');
        setLoading(false);
        return;
      }
      
      console.log('Fetching data for user:', user.uid);
      const userDoc = await getDoc(doc(db, 'responses', user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserResponse;
        console.log('User data found:', data);
        setUserResponse(data);
        generateRecommendations(data);
      } else {
        console.log('No user data found in Firestore');
        setUserResponse(null);
        setRecommendations([]);
        Alert.alert(
          'No Data Found', 
          'Please complete the questionnaire first to get personalized recommendations.',
          [
            {
              text: 'Go to Questionnaire',
              onPress: () => router.push('/(tabs)/questionnaire'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (data: UserResponse) => {
    console.log('Generating recommendations for:', data);
    const recs: Recommendation[] = [];

    const cleanserProducts = getCleanserRecommendations(data.skinType, data.budget);
    const cleanserTips = getCleanserTips(data.skinType, data.concern);
    console.log('Cleanser products:', cleanserProducts);
    console.log('Cleanser tips:', cleanserTips);
    recs.push({
      category: 'Cleanser',
      products: cleanserProducts,
      tips: cleanserTips,
    });

    const moisturizerProducts = getMoisturizerRecommendations(data.skinType, data.budget);
    const moisturizerTips = getMoisturizerTips(data.skinType, data.concern);
    console.log('Moisturizer products:', moisturizerProducts);
    console.log('Moisturizer tips:', moisturizerTips);
    recs.push({
      category: 'Moisturizer',
      products: moisturizerProducts,
      tips: moisturizerTips,
    });

    if (data.concern && data.concern !== 'none') {
      const treatmentProducts = getTreatmentRecommendations(data.concern, data.budget);
      const treatmentTips = getTreatmentTips(data.concern);
      console.log('Treatment products:', treatmentProducts);
      console.log('Treatment tips:', treatmentTips);
      recs.push({
        category: 'Treatment',
        products: treatmentProducts,
        tips: treatmentTips,
      });
    }

    const sunscreenProducts = getSunscreenRecommendations(data.skinType, data.budget);
    const sunscreenTips = getSunscreenTips(data.skinType);
    console.log('Sunscreen products:', sunscreenProducts);
    console.log('Sunscreen tips:', sunscreenTips);
    recs.push({
      category: 'Sunscreen',
      products: sunscreenProducts,
      tips: sunscreenTips,
    });

    console.log('Generated recommendations:', recs);
    setRecommendations(recs);
  };

  const getCleanserRecommendations = (skinType: string, budget: string): string[] => {
    const recommendations: { [key: string]: { [key: string]: string[] } } = {
      oily: {
        below500: ['Cetaphil Gentle Skin Cleanser', 'Neutrogena Oil-Free Acne Wash', 'Simple Kind to Skin Refreshing Facial Wash'],
        '500to1000': ['CeraVe Foaming Facial Cleanser', 'La Roche-Posay Effaclar Gel Cleanser', 'The Ordinary Squalane Cleanser'],
        '1000to2000': ['Paula\'s Choice Pore Normalizing Cleanser', 'Clinique Liquid Facial Soap', 'Kiehl\'s Ultra Facial Cleanser']
      },
      dry: {
        below500: ['Cetaphil Gentle Skin Cleanser', 'Simple Kind to Skin Refreshing Facial Wash', 'Nivea Soft Cleansing Milk'],
        '500to1000': ['CeraVe Hydrating Facial Cleanser', 'La Roche-Posay Toleriane Caring Wash', 'The Ordinary Squalane Cleanser'],
        '1000to2000': ['Clinique Take The Day Off Cleansing Balm', 'Kiehl\'s Ultra Facial Cleanser', 'Fresh Soy Face Cleanser']
      },
      combination: {
        below500: ['Cetaphil Gentle Skin Cleanser', 'Simple Kind to Skin Refreshing Facial Wash', 'Neutrogena Ultra Gentle Cleanser'],
        '500to1000': ['CeraVe Foaming Facial Cleanser', 'La Roche-Posay Toleriane Caring Wash', 'The Ordinary Squalane Cleanser'],
        '1000to2000': ['Clinique Liquid Facial Soap', 'Kiehl\'s Ultra Facial Cleanser', 'Fresh Soy Face Cleanser']
      }
    };
    return recommendations[skinType]?.[budget] || ['Cetaphil Gentle Skin Cleanser'];
  };

  const getMoisturizerRecommendations = (skinType: string, budget: string): string[] => {
    const recommendations: { [key: string]: { [key: string]: string[] } } = {
      oily: {
        below500: ['Neutrogena Oil-Free Moisture', 'Simple Kind to Skin Light Moisturizer', 'Nivea Soft Light Moisturizer'],
        '500to1000': ['CeraVe PM Facial Moisturizing Lotion', 'La Roche-Posay Effaclar Mat', 'The Ordinary Natural Moisturizing Factors'],
        '1000to2000': ['Clinique Dramatically Different Moisturizing Gel', 'Kiehl\'s Ultra Facial Oil-Free Gel', 'Paula\'s Choice Clear Oil-Free Moisturizer']
      },
      dry: {
        below500: ['Nivea Soft Light Moisturizer', 'Simple Kind to Skin Rich Moisturizer', 'Vaseline Intensive Care'],
        '500to1000': ['CeraVe Moisturizing Cream', 'La Roche-Posay Toleriane Double Repair', 'The Ordinary Natural Moisturizing Factors + HA'],
        '1000to2000': ['Clinique Dramatically Different Moisturizing Lotion+', 'Kiehl\'s Ultra Facial Cream', 'Fresh Rose Deep Hydration Face Cream']
      },
      combination: {
        below500: ['Simple Kind to Skin Light Moisturizer', 'Nivea Soft Light Moisturizer', 'Neutrogena Oil-Free Moisture'],
        '500to1000': ['CeraVe PM Facial Moisturizing Lotion', 'La Roche-Posay Toleriane Double Repair', 'The Ordinary Natural Moisturizing Factors'],
        '1000to2000': ['Clinique Dramatically Different Moisturizing Gel', 'Kiehl\'s Ultra Facial Oil-Free Gel', 'Fresh Rose Deep Hydration Face Cream']
      }
    };
    return recommendations[skinType]?.[budget] || ['CeraVe Moisturizing Cream'];
  };

  const getTreatmentRecommendations = (concern: string, budget: string): string[] => {
    const recommendations: { [key: string]: { [key: string]: string[] } } = {
      acne: {
        below500: ['The Ordinary Niacinamide 10% + Zinc 1%', 'Neutrogena Rapid Clear Stubborn Acne', 'Benzoyl Peroxide 2.5%'],
        '500to1000': ['The Ordinary Salicylic Acid 2% Solution', 'La Roche-Posay Effaclar Duo', 'CeraVe Acne Foaming Cream Cleanser'],
        '1000to2000': ['Paula\'s Choice 2% BHA Liquid Exfoliant', 'Clinique Acne Solutions Clinical Clearing Gel', 'Kiehl\'s Breakout Control Targeted Blemish Spot Treatment']
      },
      hyperpigmentation: {
        below500: ['The Ordinary Vitamin C Suspension 23%', 'Nivea Q10 Plus Anti-Wrinkle', 'Garnier Skin Naturals Vitamin C'],
        '500to1000': ['The Ordinary Alpha Arbutin 2% + HA', 'La Roche-Posay Mela-D', 'CeraVe Vitamin C Serum'],
        '1000to2000': ['Paula\'s Choice C15 Super Booster', 'Clinique Even Better Clinical Radical Dark Spot Corrector', 'Kiehl\'s Clearly Corrective Dark Spot Solution']
      },
      wrinkles: {
        below500: ['The Ordinary Retinol 0.5% in Squalane', 'Nivea Q10 Plus Anti-Wrinkle', 'Garnier Skin Naturals Anti-Age'],
        '500to1000': ['The Ordinary Granactive Retinoid 2% Emulsion', 'La Roche-Posay Redermic R', 'CeraVe Skin Renewing Retinol Serum'],
        '1000to2000': ['Paula\'s Choice 1% Retinol Treatment', 'Clinique Smart Custom-Repair Serum', 'Kiehl\'s Powerful-Strength Line-Reducing Concentrate']
      }
    };
    return recommendations[concern]?.[budget] || ['The Ordinary Niacinamide 10% + Zinc 1%'];
  };

  const getSunscreenRecommendations = (skinType: string, budget: string): string[] => {
    const recommendations: { [key: string]: { [key: string]: string[] } } = {
      oily: {
        below500: ['Neutrogena Ultra Sheer Dry-Touch', 'Nivea Sun Protect & Moisture', 'Lotus Herbals Safe Sun'],
        '500to1000': ['La Roche-Posay Anthelios Clear Skin', 'CeraVe AM Facial Moisturizing Lotion SPF 30', 'The Ordinary Mineral UV Filters SPF 30'],
        '1000to2000': ['Clinique Super City Block Oil-Free Daily Face Protector', 'Kiehl\'s Ultra Light Daily UV Defense', 'Paula\'s Choice Resist Super-Light Wrinkle Defense SPF 30']
      },
      dry: {
        below500: ['Nivea Sun Protect & Moisture', 'Lotus Herbals Safe Sun', 'Neutrogena Ultra Sheer Dry-Touch'],
        '500to1000': ['La Roche-Posay Anthelios Melt-in Milk', 'CeraVe AM Facial Moisturizing Lotion SPF 30', 'The Ordinary Mineral UV Filters SPF 30'],
        '1000to2000': ['Clinique Super City Block Oil-Free Daily Face Protector', 'Kiehl\'s Ultra Light Daily UV Defense', 'Fresh Sugar Sport Treatment Sunscreen SPF 30']
      },
      combination: {
        below500: ['Neutrogena Ultra Sheer Dry-Touch', 'Nivea Sun Protect & Moisture', 'Lotus Herbals Safe Sun'],
        '500to1000': ['La Roche-Posay Anthelios Clear Skin', 'CeraVe AM Facial Moisturizing Lotion SPF 30', 'The Ordinary Mineral UV Filters SPF 30'],
        '1000to2000': ['Clinique Super City Block Oil-Free Daily Face Protector', 'Kiehl\'s Ultra Light Daily UV Defense', 'Paula\'s Choice Resist Super-Light Wrinkle Defense SPF 30']
      }
    };
    return recommendations[skinType]?.[budget] || ['Neutrogena Ultra Sheer Dry-Touch'];
  };

  const getCleanserTips = (skinType: string, concern: string): string[] => {
    const tips = [
      'Wash your face twice daily - morning and evening',
      'Use lukewarm water, not hot water',
      'Gently massage the cleanser in circular motions',
      'Rinse thoroughly with water'
    ];
    
    if (skinType === 'oily') {
      tips.push('Look for oil-free or gel-based cleansers');
      tips.push('Avoid over-cleansing as it can strip natural oils');
    } else if (skinType === 'dry') {
      tips.push('Use cream-based or milky cleansers');
      tips.push('Avoid foaming cleansers that can be drying');
    }
    
    if (concern === 'acne') {
      tips.push('Look for cleansers with salicylic acid or benzoyl peroxide');
    }
    
    return tips;
  };

  const getMoisturizerTips = (skinType: string, concern: string): string[] => {
    const tips = [
      'Apply moisturizer while skin is still damp',
      'Use morning and evening after cleansing',
      'Don\'t forget your neck and décolletage'
    ];
    
    if (skinType === 'oily') {
      tips.push('Choose oil-free or gel-based moisturizers');
      tips.push('Look for "non-comedogenic" on the label');
    } else if (skinType === 'dry') {
      tips.push('Use richer, cream-based moisturizers');
      tips.push('Consider layering with facial oils');
    }
    
    return tips;
  };

  const getTreatmentTips = (concern: string): string[] => {
    const tips: { [key: string]: string[] } = {
      acne: [
        'Start with lower concentrations and build up gradually',
        'Use treatments in the evening to avoid sun sensitivity',
        'Don\'t pick or pop pimples',
        'Be patient - results take 4-8 weeks'
      ],
      hyperpigmentation: [
        'Always use sunscreen to prevent further darkening',
        'Vitamin C works best in the morning',
        'Results can take 8-12 weeks to see improvement',
        'Be consistent with application'
      ],
      wrinkles: [
        'Start with retinol 2-3 times per week',
        'Always use sunscreen when using retinol',
        'Apply at night as retinol can make skin sensitive to sun',
        'Results typically visible after 8-12 weeks'
      ]
    };
    return tips[concern] || [];
  };

  const getSunscreenTips = (skinType: string): string[] => {
    const tips = [
      'Apply sunscreen 15-30 minutes before sun exposure',
      'Use SPF 30 or higher',
      'Reapply every 2 hours when outdoors',
      'Don\'t forget ears, neck, and hands'
    ];
    
    if (skinType === 'oily') {
      tips.push('Look for oil-free or mattifying sunscreens');
      tips.push('Consider powder sunscreens for touch-ups');
    }
    
    return tips;
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>You are not logged in.</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchUserData}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your personalized recommendations...</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchUserData}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!userResponse) {
    return (
      <View style={styles.container}>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No questionnaire data found.</Text>
          <Text style={styles.noDataSubtext}>Please complete the questionnaire first to get personalized recommendations.</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchUserData}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.questionnaireButton} onPress={() => router.push('/(tabs)/questionnaire')}>
            <Text style={styles.questionnaireButtonText}>Take Questionnaire</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={['#4A776D']}
          tintColor="#4A776D"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Personalized Skincare Routine</Text>
        <Text style={styles.subtitle}>
          Based on your {userResponse?.skinType || 'skin'} skin and {userResponse?.concern || 'concerns'}
        </Text>
      </View>

      {recommendations.length > 0 ? (
        recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationCard}>
            <Text style={styles.categoryTitle}>{rec.category}</Text>
            
            <View style={styles.productsSection}>
              <Text style={styles.sectionTitle}>Recommended Products:</Text>
              {rec.products.map((product, productIndex) => (
                <View key={productIndex} style={styles.productItem}>
                  <Text style={styles.productText}>• {product}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>Application Tips:</Text>
              {rec.tips.map((tip, tipIndex) => (
                <View key={tipIndex} style={styles.tipItem}>
                  <Text style={styles.tipText}>• {tip}</Text>
                </View>
              ))}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.noRecommendationsCard}>
          <Text style={styles.noRecommendationsText}>No recommendations available</Text>
          <Text style={styles.noRecommendationsSubtext}>
            Complete the questionnaire to get personalized recommendations
          </Text>
          <TouchableOpacity 
            style={styles.questionnaireButton} 
            onPress={() => router.push('/(tabs)/questionnaire')}
          >
            <Text style={styles.questionnaireButtonText}>Take Questionnaire</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Remember: Consistency is key! Stick to your routine for best results.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EC',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: isLargeScreen ? 36 : 32,
    fontWeight: 'bold',
    color: '#4A776D',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: isLargeScreen ? 22 : 20,
    color: '#666',
    textAlign: 'center',
    lineHeight: 28,
  },
  recommendationCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryTitle: {
    fontSize: isLargeScreen ? 28 : 26,
    fontWeight: 'bold',
    color: '#4A776D',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: isLargeScreen ? 20 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 16,
  },
  productsSection: {
    marginBottom: 20,
  },
  productItem: {
    marginBottom: 8,
  },
  productText: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#555',
    lineHeight: 24,
    fontWeight: '500',
  },
  tipsSection: {
    marginBottom: 12,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: isLargeScreen ? 17 : 15,
    color: '#666',
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  loadingText: {
    fontSize: isLargeScreen ? 22 : 20,
    color: '#666',
    textAlign: 'center',
    marginTop: 60,
    fontWeight: '500',
  },
  noDataText: {
    fontSize: isLargeScreen ? 24 : 22,
    color: '#666',
    textAlign: 'center',
    marginTop: 60,
    fontWeight: 'bold',
  },
  noDataSubtext: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  refreshButton: {
    backgroundColor: '#4A776D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: isLargeScreen ? 16 : 14,
    fontWeight: 'bold',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  questionnaireButton: {
    backgroundColor: '#4A776D',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  questionnaireButtonText: {
    color: '#fff',
    fontSize: isLargeScreen ? 18 : 16,
    fontWeight: 'bold',
  },
  noRecommendationsCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  noRecommendationsText: {
    fontSize: isLargeScreen ? 24 : 22,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  noRecommendationsSubtext: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
});
