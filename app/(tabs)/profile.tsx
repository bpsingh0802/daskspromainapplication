// import { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { typography } from '@/constants/typography';
// import { colors } from '@/constants/colors';
// import { spacing } from '@/constants/spacing';
// import {
//   ChevronRight, Settings, CreditCard, Bell, Shield, CircleHelp, LogOut, User,
//   Edit, MapPin, Phone, Mail, Briefcase, Star, Award
// } from 'lucide-react-native';
// import { useAuth } from '@/hooks/useAuth';
// import {
//   getUserProfile,
//   getProfessionalProfile,
//   getLabourProfile,
//   getCustomerProfile,
//   UserProfile,
//   ProfessionalProfile,
//   LabourProfile,
//   CustomerProfile
// } from '@/lib/profileApi';
// import Button from '@/components/common/Button';
// import ErrorBoundary from '@/components/common/ErrorBoundary';

// // Define a union type for profiles that have common fields
// type WorkerProfile = ProfessionalProfile | LabourProfile;

// export default function ProfileScreen() {
//   const { user, signOut } = useAuth();
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
//   const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (user) {
//       fetchProfileData();
//     } else {
//       setLoading(false);
//     }
//   }, [user]);

//   const fetchProfileData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       if (!user?.id) throw new Error('You are not signed in.');

//       const baseProfile = await getUserProfile();

//       // ✅ **CRASH FIX**: This check prevents the app from crashing if the profile is missing or incomplete.
//       if (!baseProfile || !baseProfile.user_type) {
//         throw new Error('Your user profile is incomplete or could not be found.');
//       }
      
//       setUserProfile(baseProfile);

//       // This code is now safe to run because of the check above
//       switch (baseProfile.user_type) {
//         case 'professional':
//           const profProfile = await getProfessionalProfile();
//           setWorkerProfile(profProfile);
//           break;
//         case 'labour':
//           const labourProfileData = await getLabourProfile();
//           setWorkerProfile(labourProfileData);
//           break;
//         case 'customer':
//           const customerProfileData = await getCustomerProfile();
//           setCustomerProfile(customerProfileData);
//           break;
//         default:
//           console.warn('Unknown user type:', baseProfile.user_type);
//       }
//     } catch (err: any) {
//       console.error('Failed to fetch profile data:', err);
//       setError(err.message || 'An unknown error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchProfileData();
//     setRefreshing(false);
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       'Sign Out',
//       'Are you sure you want to sign out?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Sign Out',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await signOut();
//               router.replace('/');
//             } catch (err) {
//               console.error('Error signing out:', err);
//               Alert.alert('Error', 'Failed to sign out.');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleMenuPress = (featureName: string) => {
//     console.log(`Pressed the "${featureName}" button.`);
//   };

//   const getDisplayName = () => {
//     return workerProfile?.business_name || userProfile?.full_name || 'User';
//   };

//   const getDisplayEmail = () => {
//     return userProfile?.email || user?.email || 'No email provided';
//   };

//   const getUserTypeDisplay = () => {
//     if (!userProfile?.user_type) return 'User';
//     return userProfile.user_type.charAt(0).toUpperCase() + userProfile.user_type.slice(1);
//   };

//   if (loading) {
//     return (
//       <View style={styles.centeredContainer}>
//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.centeredContainer} edges={['top']}>
//         <Text style={styles.errorTitle}>Profile Error</Text>
//         <Text style={styles.errorText}>{error}</Text>
//         <Button title="Retry" onPress={fetchProfileData} style={styles.button} />
//         <Button title="Sign Out" variant="outline" onPress={handleLogout} style={styles.button} />
//       </SafeAreaView>
//     );
//   }

//   if (!user || !userProfile) {
//     return (
//       <SafeAreaView style={styles.centeredContainer} edges={['top']}>
//         <Text style={styles.errorTitle}>Not Signed In</Text>
//         <Text style={styles.errorText}>Please sign in to view your profile.</Text>
//         <Button title="Go to Sign In" onPress={() => router.replace('/')} style={styles.button} />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <ErrorBoundary>
//       <SafeAreaView style={styles.container} edges={['top']}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         >
//           <View style={styles.header}>
//             <Text style={styles.title}>Profile</Text>
//             <TouchableOpacity style={styles.iconButton} onPress={() => handleMenuPress('Settings')}>
//               <Settings size={24} color={colors.gray[700]} />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.profileCard}>
//             <Image
//               source={{ uri: workerProfile?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
//               style={styles.avatar}
//             />
//             <View style={styles.profileInfo}>
//               <Text style={styles.name}>{getDisplayName()}</Text>
//               <Text style={styles.email}>{getDisplayEmail()}</Text>
//               <View style={styles.userTypeContainer}>
//                 <User size={14} color={colors.primary[600]} />
//                 <Text style={styles.userType}>{getUserTypeDisplay()}</Text>
//               </View>
//             </View>
//             <TouchableOpacity style={styles.editButton} onPress={() => handleMenuPress('Edit Profile')}>
//               <Edit size={16} color={colors.primary[600]} />
//             </TouchableOpacity>
//           </View>

//           {workerProfile && (
//             <View style={styles.statsContainer}>
//               <View style={styles.statItem}>
//                 <Star size={16} color={colors.warning[500]} />
//                 <Text style={styles.statText}>{workerProfile.rating?.toFixed(1) || 'N/A'} Rating</Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Award size={16} color={colors.primary[600]} />
//                 <Text style={styles.statText}>{workerProfile.years_of_experience || 0} Years Exp</Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Briefcase size={16} color={colors.success[600]} />
//                 <Text style={styles.statText}>
//                   {userProfile.user_type === 'professional' ? `$${workerProfile.hourly_rate || 0}/hr` : `$${workerProfile.daily_rate || 0}/day`}
//                 </Text>
//               </View>
//             </View>
//           )}

//           <Section title="Details">
//             <DetailItem icon={<Phone size={16} color={colors.gray[600]} />} text={userProfile.phone} />
//             <DetailItem icon={<Mail size={16} color={colors.gray[600]} />} text={getDisplayEmail()} />
//             <DetailItem icon={<MapPin size={16} color={colors.gray[600]} />} text={workerProfile?.location} />
//             <DetailItem icon={<Briefcase size={16} color={colors.gray[600]} />} text={userProfile.user_type === 'professional' ? workerProfile?.profession : workerProfile?.category} />
//           </Section>

//           {workerProfile?.bio && (
//             <View style={styles.bioSection}>
//               <Text style={styles.sectionTitle}>About</Text>
//               <Text style={styles.bioText}>{workerProfile.bio}</Text>
//             </View>
//           )}
          
//           {(workerProfile?.tags && workerProfile.tags.length > 0) && (
//              <View style={styles.skillsSection}>
//                <Text style={styles.sectionTitle}>Skills & Expertise</Text>
//                <View style={styles.tagsContainer}>
//                 {workerProfile.tags.map((tag, index) => (
//                    <View key={index} style={styles.tag}>
//                      <Text style={styles.tagText}>{tag}</Text>
//                    </View>
//                  ))}
//                </View>
//              </View>
//           )}

//           <Section title="Account">
//             <MenuItem icon={<CreditCard size={20} color={colors.gray[700]} />} text="Payment Methods" onPress={() => handleMenuPress('Payment Methods')} />
//             <MenuItem icon={<Bell size={20} color={colors.gray[700]} />} text="Notification Settings" onPress={() => handleMenuPress('Notification Settings')} />
//             <MenuItem icon={<Shield size={20} color={colors.gray[700]} />} text="Privacy & Security" onPress={() => handleMenuPress('Privacy & Security')} />
//           </Section>

//           <Section title="Support">
//             <MenuItem icon={<CircleHelp size={20} color={colors.gray[700]} />} text="Help Center" onPress={() => handleMenuPress('Help Center')} />
//             <MenuItem icon={<LogOut size={20} color={colors.error[600]} />} text="Sign Out" textStyle={{ color: colors.error[600] }} onPress={handleLogout} />
//           </Section>

//           <View style={styles.footer}>
//             <Text style={styles.version}>Version 1.0.0</Text>
//             <Text style={styles.userId}>User ID: {user?.id?.slice(0, 8)}...</Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </ErrorBoundary>
//   );
// }

// // Reusable Components
// const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>{title}</Text>
//     <View style={styles.menuList}>{children}</View>
//   </View>
// );

// const MenuItem = ({ icon, text, onPress, textStyle }: { icon: React.ReactNode; text: string; onPress: () => void; textStyle?: object }) => (
//   <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
//     {icon}
//     <Text style={[styles.menuItemText, textStyle]}>{text}</Text>
//     <ChevronRight size={20} color={colors.gray[400]} />
//   </TouchableOpacity>
// );

// const DetailItem = ({ icon, text }: { icon: React.ReactNode; text?: string | null }) => {
//   if (!text) return null;
//   return (
//     <View style={styles.detailItem}>
//       {icon}
//       <Text style={styles.detailText}>{text}</Text>
//     </View>
//   );
// };

// // Stylesheet
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: spacing.xl,
//     backgroundColor: colors.white,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: spacing.md,
//     marginBottom: spacing.md,
//   },
//   title: {
//     ...typography.headingLarge,
//     color: colors.gray[900],
//   },
//   iconButton: {
//     padding: spacing.xs,
//   },
//   profileCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.gray[50],
//     marginHorizontal: spacing.md,
//     marginBottom: spacing.lg,
//     padding: spacing.md,
//     borderRadius: 12,
//   },
//   avatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     borderWidth: 2,
//     borderColor: colors.primary[100],
//   },
//   profileInfo: {
//     flex: 1,
//     marginLeft: spacing.md,
//   },
//   name: {
//     ...typography.headingMedium,
//     color: colors.gray[900],
//     marginBottom: spacing.xs,
//   },
//   email: {
//     ...typography.bodyMedium,
//     color: colors.gray[600],
//     marginBottom: spacing.xs,
//   },
//   userTypeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.xs,
//   },
//   userType: {
//     ...typography.labelSmall,
//     color: colors.primary[600],
//     fontFamily: 'Inter-Medium',
//   },
//   editButton: {
//     padding: spacing.sm,
//     backgroundColor: colors.primary[50],
//     borderRadius: 8,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: colors.gray[50],
//     marginHorizontal: spacing.md,
//     marginBottom: spacing.lg,
//     padding: spacing.md,
//     borderRadius: 12,
//   },
//   statItem: {
//     alignItems: 'center',
//     gap: spacing.xs,
//   },
//   statText: {
//     ...typography.bodySmall,
//     color: colors.gray[700],
//     fontFamily: 'Inter-Medium',
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.sm,
//     paddingVertical: spacing.sm,
//   },
//   detailText: {
//     ...typography.bodyMedium,
//     color: colors.gray[700],
//   },
//   bioSection: {
//     marginHorizontal: spacing.md,
//     marginBottom: spacing.lg,
//     padding: spacing.md,
//     backgroundColor: colors.gray[50],
//     borderRadius: 12,
//   },
//   bioText: {
//     ...typography.bodyMedium,
//     color: colors.gray[700],
//     lineHeight: 22,
//   },
//   skillsSection: {
//     marginHorizontal: spacing.md,
//     marginBottom: spacing.lg,
//     padding: spacing.md,
//     backgroundColor: colors.gray[50],
//     borderRadius: 12,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: spacing.sm,
//   },
//   tag: {
//     backgroundColor: colors.primary[50],
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.sm,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: colors.primary[200],
//   },
//   tagText: {
//     ...typography.bodySmall,
//     color: colors.primary[700],
//     fontFamily: 'Inter-Medium',
//   },
//   section: {
//     marginBottom: spacing.lg,
//   },
//   sectionTitle: {
//     ...typography.headingSmall,
//     color: colors.gray[800],
//     marginHorizontal: spacing.md,
//     marginBottom: spacing.sm,
//   },
//   menuList: {
//     marginHorizontal: spacing.md,
//     backgroundColor: colors.gray[50],
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: spacing.md,
//     paddingHorizontal: spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.gray[100],
//   },
//   menuItemText: {
//     ...typography.bodyMedium,
//     color: colors.gray[800],
//     flex: 1,
//     marginLeft: spacing.md,
//   },
//   footer: {
//     alignItems: 'center',
//     marginVertical: spacing.xl,
//     gap: spacing.xs,
//   },
//   version: {
//     ...typography.bodySmall,
//     color: colors.gray[500],
//   },
//   userId: {
//     ...typography.bodySmall,
//     color: colors.gray[400],
//   },
//   loadingText: {
//     ...typography.bodyLarge,
//     color: colors.gray[600],
//     marginBottom: spacing.md,
//   },
//   errorTitle: {
//     ...typography.headingLarge,
//     color: colors.error[600],
//     marginBottom: spacing.sm,
//     textAlign: 'center',
//   },
//   errorText: {
//     ...typography.bodyMedium,
//     color: colors.gray[600],
//     textAlign: 'center',
//     marginBottom: spacing.lg,
//   },
//   button: {
//     width: 200,
//     marginBottom: spacing.md,
//   },
// });

// //new


import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

import {
  ChevronRight,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Star,
  Award,
  User,
} from 'lucide-react-native';

import { useAuth } from '../(context)/AuthContext';

import {
  getUserProfile,
  getProfessionalProfile,
  getLabourProfile,
  getCustomerProfile,
} from '@/lib/profileApi';

export default function ProfileScreen() {
  const { user, loading: authLoading, signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [userProfile, setUserProfile] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);

    let base = await getUserProfile();

    if (!base) {
      base = { user_type: 'customer' };
    }

    setUserProfile(base);

    if (base.user_type === "professional") {
      setWorkerProfile(await getProfessionalProfile());
      setCustomerProfile(null);
    } else if (base.user_type === "labour") {
      setWorkerProfile(await getLabourProfile());
      setCustomerProfile(null);
    } else {
      setCustomerProfile(await getCustomerProfile());
      setWorkerProfile(null);
    }

    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    console.log("🔥 logout pressed");
    await signOut();
    router.replace('/login');
  };

  if (loading || authLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!user || !userProfile) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No user found</Text>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text>Go to login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri:
                workerProfile?.avatar ||
                'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.name}>{userProfile.full_name}</Text>
            <Text style={styles.email}>{userProfile.email}</Text>

            {userProfile?.user_type && (
              <View style={styles.userTypeBox}>
                <User size={14} color={colors.primary[700]} />
                <Text style={styles.userType}>
                  {userProfile.user_type.charAt(0).toUpperCase() + userProfile.user_type.slice(1)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        {workerProfile && (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Star size={18} color={colors.warning[500]} />
              <Text>{workerProfile.rating || "N/A"} Rating</Text>
            </View>

            <View style={styles.stat}>
              <Award size={18} color={colors.primary[500]} />
              <Text>{workerProfile.years_of_experience || 0} Years</Text>
            </View>

            <View style={styles.stat}>
              <Briefcase size={18} color={colors.success[500]} />
              <Text>
                {userProfile?.user_type === "professional"
                  ? `₹${workerProfile?.hourly_rate}/hr`
                  : `₹${workerProfile?.daily_rate}/day`}
              </Text>
            </View>
          </View>
        )}

        {/* Details */}
        <Section title="Details">
          <Detail icon={<Phone size={18} />} text={userProfile.phone} />
          <Detail icon={<Mail size={18} />} text={userProfile.email} />
          <Detail icon={<MapPin size={18} />} text={workerProfile?.location} />
          {userProfile?.user_type !== 'customer' && (
            <Detail
              icon={<Briefcase size={18} />}
              text={workerProfile?.profession || workerProfile?.category}
            />
          )}
        </Section>

        {/* Account */}
        <Section title="Account">
          <MenuItem text="Payment Methods" onPress={() => console.log("Payment")} />
          <MenuItem text="Notification Settings" onPress={() => console.log("Notifications")} />
        </Section>

        {/* Support */}
        <Section title="Support">
          <MenuItem text="Help Center" onPress={() => console.log("Help")} />

          {/* Logout Button */}
          <MenuItem
            text="Logout"
            danger
            icon={<LogOut size={20} color={colors.error[600]} />}
            onPress={handleLogout}
          />
        </Section>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------- */
/* Components */
/* ------------------------------------------------- */

const Section = ({ title, children }) => (
  <View style={{ marginBottom: spacing.lg }}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionBox}>{children}</View>
  </View>
);

const MenuItem = ({ text, onPress, icon, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    {icon}
    <Text style={[styles.menuText, danger && { color: colors.error[600] }]}>
      {text}
    </Text>
    <ChevronRight size={20} color={colors.gray[400]} />
  </TouchableOpacity>
);

const Detail = ({ icon, text }) => {
  if (!text) return null;
  return (
    <View style={styles.detailRow}>
      {icon}
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
};

/* ------------------------------------------------- */
/* Styles */
/* ------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: colors.gray[50],
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  name: {
    ...typography.headingMedium,
    color: colors.gray[900],
  },
  email: {
    ...typography.bodyMedium,
    color: colors.gray[600],
    marginBottom: 4,
  },
  userTypeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userType: {
    color: colors.primary[700],
    ...typography.labelSmall,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.gray[50],
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    ...typography.headingSmall,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionBox: {
    backgroundColor: colors.gray[50],
    marginHorizontal: spacing.md,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    gap: spacing.md,
  },
  detailText: {
    color: colors.gray[800],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    gap: spacing.md,
  },
  menuText: {
    flex: 1,
    ...typography.bodyMedium,
  },
});

