import { useFocusEffect, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/authContext';
import { auth, db } from '../../firebase/firebaseConfig';

const screenWidth = Dimensions.get('window').width;
const isLargeScreen = screenWidth >= 768;

interface UserResponse {
  skinType: string;
  budget: string;
  concern: string;
}

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [userResponse, setUserResponse] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [user])
  );

  const fetchUserData = async () => {
    try {
      if (!user) {
        console.log('No user found in profile');
        setLoading(false);
        return;
      }
      
      console.log('Fetching profile data for user:', user.uid);
      const userDoc = await getDoc(doc(db, 'responses', user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserResponse;
        console.log('Profile data found:', data);
        setUserResponse(data);
      } else {
        console.log('No profile data found in Firestore');
        setUserResponse(null);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      Alert.alert('Error', 'Failed to load your profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    console.log('Sign out button pressed');
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              console.log('Sign out successful');
              console.log('Attempting router.replace("/login")');
              router.replace('/login');
              setTimeout(() => {
                console.log('Attempting router.push("/login") as fallback');
                router.push('/login');
              }, 500);
            } catch (error) {
              console.error('Error signing out:', error);
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              Alert.alert('Error', `Failed to sign out: ${errorMessage}`);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.loadingText}>You are not logged in.</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchUserData}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleEditProfile = () => {
    router.push('/(tabs)/questionnaire');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Not Implemented', 'Account deletion feature will be implemented in a future update.');
          },
        },
      ]
    );
  };

  const getSkinTypeDisplay = (skinType: string) => {
    const displayNames: { [key: string]: string } = {
      oily: 'Oily',
      dry: 'Dry',
      combination: 'Combination',
    };
    return displayNames[skinType] || skinType;
  };

  const getConcernDisplay = (concern: string) => {
    const displayNames: { [key: string]: string } = {
      acne: 'Acne',
      hyperpigmentation: 'Hyperpigmentation',
      wrinkles: 'Wrinkles',
    };
    return displayNames[concern] || concern;
  };

  const getBudgetDisplay = (budget: string) => {
    const displayNames: { [key: string]: string } = {
      below500: 'Below Rs. 500',
      '500to1000': 'Rs. 500 - 1000',
      '1000to2000': 'Rs. 1000 - 2000',
    };
    return displayNames[budget] || budget;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your profile...</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchUserData}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          Member since {user?.metadata?.creationTime ? 
            new Date(user.metadata.creationTime).toLocaleDateString() : 
            'Recently'
          }
        </Text>
      </View>

      {/* Skin Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Skin Profile</Text>
        {userResponse ? (
          <View style={styles.profileCard}>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Skin Type:</Text>
              <Text style={styles.profileValue}>
                {getSkinTypeDisplay(userResponse.skinType)}
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Primary Concern:</Text>
              <Text style={styles.profileValue}>
                {getConcernDisplay(userResponse.concern)}
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Budget Range:</Text>
              <Text style={styles.profileValue}>
                {getBudgetDisplay(userResponse.budget)}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Update Skin Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noProfileCard}>
            <Text style={styles.noProfileText}>No skin profile found</Text>
            <Text style={styles.noProfileSubtext}>
              Complete the questionnaire to get personalized recommendations
            </Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Take Questionnaire</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Get reminders for your skincare routine
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#4A776D' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch to dark theme
              </Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#767577', true: '#4A776D' }}
              thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.supportCard}>
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportLabel}>Help & FAQ</Text>
            <Text style={styles.supportArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportLabel}>Contact Support</Text>
            <Text style={styles.supportArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportLabel}>Privacy Policy</Text>
            <Text style={styles.supportArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <Text style={styles.supportLabel}>Terms of Service</Text>
            <Text style={styles.supportArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.accountCard}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Version */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>My Skin App v1.0.0</Text>
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
    alignItems: 'center',
    padding: 28,
    backgroundColor: '#fff',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4A776D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: isLargeScreen ? 24 : 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  memberSince: {
    fontSize: isLargeScreen ? 16 : 14,
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: isLargeScreen ? 26 : 24,
    fontWeight: 'bold',
    color: '#4A776D',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 28,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileLabel: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#666',
    fontWeight: '600',
  },
  profileValue: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#333',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#4A776D',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: isLargeScreen ? 18 : 16,
    fontWeight: 'bold',
  },
  noProfileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  noProfileText: {
    fontSize: isLargeScreen ? 24 : 22,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noProfileSubtext: {
    fontSize: isLargeScreen ? 16 : 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  settingsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 20,
  },
  settingLabel: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  settingDescription: {
    fontSize: isLargeScreen ? 16 : 14,
    color: '#666',
    lineHeight: 20,
  },
  supportCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  supportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  supportLabel: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#333',
    fontWeight: '600',
  },
  supportArrow: {
    fontSize: isLargeScreen ? 24 : 22,
    color: '#666',
    fontWeight: 'bold',
  },
  accountCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButton: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
    backgroundColor: '#4A776D',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    fontSize: isLargeScreen ? 20 : 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteAccountButton: {
    padding: 20,
    alignItems: 'center',
  },
  deleteAccountText: {
    fontSize: isLargeScreen ? 18 : 16,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    padding: 28,
  },
  versionText: {
    fontSize: isLargeScreen ? 16 : 14,
    color: '#888',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: isLargeScreen ? 24 : 22,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  refreshButton: {
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
  refreshButtonText: {
    color: '#fff',
    fontSize: isLargeScreen ? 18 : 16,
    fontWeight: 'bold',
  },
});
