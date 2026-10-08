// import { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Platform, Dimensions, FlatList, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { typography } from '@/constants/typography';
// import { colors } from '@/constants/colors';
// import { spacing } from '@/constants/spacing';
// import { LinearGradient } from 'expo-linear-gradient';
// import CategoryList from '@/components/services/CategoryList';
// import LocationPicker from '@/components/search/LocationPicker';
// import SearchBar from '@/components/search/SearchBar';
// import ProfessionalCard from '@/components/services/ProfessionalCard';
// import { searchServiceProviders, ServiceProvider } from '@/lib/api';
// import { useLocation } from '@/hooks/useLocation'; // Import the hook HERE

// export default function HomeScreen() {
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [serviceType, setServiceType] = useState<'professional' | 'labour' | 'all'>('all');
//   const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [providers, setProviders] = useState<ServiceProvider[]>([]);
//   const [loading, setLoading] = useState(true); // Start loading initially

//   // ## FIX 1: Use the location hook directly in the HomeScreen ##
//   const locationData = useLocation();
//   const deviceLocation = locationData?.location;
//   const isLocationLoading = locationData?.loading;
  
//   // This effect sets the *initial* location from the device, but only ONCE.
//   useEffect(() => {
//     if (deviceLocation && !selectedLocation) {
//         setSelectedLocation(deviceLocation);
//     }
//   }, [deviceLocation]);

//   useEffect(() => {
//     const fetchProviders = async () => {
//       if (!selectedLocation) {
//         setProviders([]);
//         // We set loading to false if there's no location, to stop the initial spinner
//         if(!isLocationLoading) setLoading(false);
//         return;
//       }
      
//       setLoading(true);
      
//       const categoryFilter = activeCategory === 'all' ? undefined : activeCategory;
//       const queryFilter = searchQuery.trim() === '' ? undefined : searchQuery;

//       const data = await searchServiceProviders(
//         serviceType,
//         queryFilter,
//         selectedLocation,
//         categoryFilter
//       );
      
//       setProviders(data);
//       setLoading(false);
//     };

//     fetchProviders();
//   }, [serviceType, selectedLocation, activeCategory, searchQuery]);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//   };

//   const handleLocationSelect = (location: string | null) => {
//     setSelectedLocation(location);
//   };

//   const handleServiceTypeChange = (type: 'professional' | 'labour' | 'all') => {
//     setServiceType(type);
//     setActiveCategory('all');
//   };

//   const handleCategorySelect = (category: string) => {
//     setActiveCategory(category);
//   };

//   const handleProviderPress = (provider: ServiceProvider) => {
//     router.push(`/professional/${provider.id}`);
//   };

//   const screenWidth = Dimensions.get('window').width;
//   const numColumns = Platform.OS === 'web' && screenWidth > 768 ? 4 : 2;

//   const renderHeader = () => (
//     <>
//       <LinearGradient
//         colors={[colors.primary[50], 'transparent']}
//         style={styles.headerGradient}
//       >
//         <View style={styles.header}>
//           <Text style={styles.welcomeText}>Find the right professional</Text>
//           <Text style={styles.subtitle}>Connect with trusted professionals and skilled labour</Text>
//           {/* ## FIX 2: Pass the location and loading state DOWN to the LocationPicker ## */}
//           <LocationPicker 
//             onLocationSelect={handleLocationSelect}
//             currentLocation={selectedLocation}
//             isLoading={isLocationLoading && !selectedLocation}
//           />
//           <SearchBar onSearch={handleSearch} />
//         </View>
//       </LinearGradient>
      
//       <View style={styles.categoriesContainer}>
//         <Text style={styles.sectionTitle}>Browse Services</Text>
//         <CategoryList
//           activeCategory={activeCategory}
//           onSelectCategory={handleCategorySelect}
//           serviceType={serviceType}
//           onServiceTypeChange={handleServiceTypeChange}
//         />
//       </View>

//       <View style={styles.resultsHeader}>
//         <Text style={styles.resultsTitle}>
//           {serviceType === 'all' ? 'All Services' :
//             serviceType === 'professional' ? 'Professionals' : 'Labour'}
//         </Text>
//         <Text style={styles.resultsCount}>
//           {providers.length} {providers.length === 1 ? 'result' : 'results'}
//         </Text>
//       </View>
//     </>
//   );

//   const renderProvider = ({ item }: { item: ServiceProvider }) => (
//     <View style={styles.cardContainer}>
//       <ProfessionalCard
//         provider={item}
//         onPress={() => handleProviderPress(item)}
//       />
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <FlatList
//         data={providers}
//         renderItem={renderProvider}
//         keyExtractor={(item) => item.id}
//         numColumns={numColumns}
//         key={numColumns}
//         ListHeaderComponent={renderHeader}
//         style={{ opacity: loading ? 0.7 : 1.0 }}
//         ListEmptyComponent={
//           !loading ? (
//             <Text style={styles.emptyText}>
//               {!selectedLocation 
//                 ? 'Please select a location to begin.'
//                 : 'No results found. Try adjusting your filters.'}
//             </Text>
//           ) : null
//         }
//         ListFooterComponent={
//             loading ? <ActivityIndicator size="large" color={colors.primary[600]} style={{ marginTop: 20 }}/> : null
//         }
//         contentContainerStyle={styles.listContentContainer}
//       />
//     </SafeAreaView>
//   );
// }

// // Styles remain unchanged
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.white },
//   listContentContainer: { paddingBottom: spacing.xl },
//   headerGradient: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
//   header: { gap: spacing.md, marginTop: spacing.md },
//   welcomeText: { ...typography.headingLarge, color: colors.gray[900], textAlign: 'center' },
//   subtitle: { ...typography.bodyLarge, color: colors.gray[600], textAlign: 'center', marginBottom: spacing.md },
//   categoriesContainer: { paddingHorizontal: spacing.md, backgroundColor: colors.white, paddingVertical: spacing.sm, marginBottom: spacing.lg },
//   sectionTitle: { ...typography.headingMedium, color: colors.gray[900], marginBottom: spacing.md },
//   resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg, paddingHorizontal: spacing.md },
//   resultsTitle: { ...typography.headingSmall, color: colors.gray[900] },
//   resultsCount: { ...typography.bodyMedium, color: colors.gray[600] },
//   cardContainer: { flex: 1 / (Platform.OS === 'web' && Dimensions.get('window').width > 768 ? 4 : 2), paddingHorizontal: spacing.sm, marginBottom: spacing.md },
//   emptyText: { ...typography.bodyLarge, color: colors.gray[600], textAlign: 'center', width: '100%', marginTop: spacing.xl, lineHeight: 24, paddingHorizontal: spacing.md },
// });















// import { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Platform, Dimensions, FlatList, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { typography } from '@/constants/typography';
// import { colors } from '@/constants/colors';
// import { spacing } from '@/constants/spacing';
// import { LinearGradient } from 'expo-linear-gradient';
// import CategoryList from '@/components/services/CategoryList';
// import LocationPicker from '@/components/search/LocationPicker';
// import SearchBar from '@/components/search/SearchBar';
// import ProfessionalCard from '@/components/services/ProfessionalCard';
// import { searchServiceProviders, ServiceProvider } from '@/lib/api';
// // 📍 STATE CHANGE: Remove the local location hook
// // import { useLocation } from '@/hooks/useLocation'; 
// import { useGlobalLocation } from '../(context)/LocationContext'; // 📍 STATE CHANGE: Import global hook

// export default function HomeScreen() {
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [serviceType, setServiceType] = useState<'professional' | 'labour' | 'all'>('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [providers, setProviders] = useState<ServiceProvider[]>([]);
//   const [loading, setLoading] = useState(true); // Start loading initially

//   // 📍 STATE CHANGE: Use the global location hook
//   const { location: selectedLocation, setLocation: setSelectedLocation, isLoading: isLocationLoading } = useGlobalLocation();
  
//   // 📍 STATE CHANGE: This effect is no longer needed, as the Provider handles the initial location
//   // useEffect(() => {
//   //   if (deviceLocation && !selectedLocation) {
//   //       setSelectedLocation(deviceLocation);
//   //   }
//   // }, [deviceLocation]);

//   useEffect(() => {
//     const fetchProviders = async () => {
//       // 📍 STATE CHANGE: Use global 'selectedLocation'
//       if (!selectedLocation) {
//         setProviders([]);
//         // We set loading to false if there's no location, to stop the initial spinner
//         // 📍 STATE CHANGE: Use global 'isLocationLoading'
//         if(!isLocationLoading) setLoading(false);
//         return;
//       }
      
//       setLoading(true);
      
//       const categoryFilter = activeCategory === 'all' ? undefined : activeCategory;
//       const queryFilter = searchQuery.trim() === '' ? undefined : searchQuery;

//       const data = await searchServiceProviders(
//         serviceType,
//         queryFilter,
//         selectedLocation,
//         categoryFilter
//       );
      
//       setProviders(data);
//       setLoading(false);
//     };

//     fetchProviders();
//     // 📍 STATE CHANGE: Depend on the global 'selectedLocation'
//   }, [serviceType, selectedLocation, activeCategory, searchQuery]);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//   };

//   const handleLocationSelect = (location: string | null) => {
//     // 📍 STATE CHANGE: Call the global 'setSelectedLocation'
//     setSelectedLocation(location);
//   };

//   const handleServiceTypeChange = (type: 'professional' | 'labour' | 'all') => {
//     setServiceType(type);
//     setActiveCategory('all');
//   };

//   const handleCategorySelect = (category: string) => {
//     setActiveCategory(category);
//   };

//   const handleProviderPress = (provider: ServiceProvider) => {
//     router.push(`/professional/${provider.id}`);
//   };

//   const screenWidth = Dimensions.get('window').width;
//   const numColumns = Platform.OS === 'web' && screenWidth > 768 ? 4 : 2;

//   const renderHeader = () => (
//     <>
//       <LinearGradient
//         colors={[colors.primary[50], 'transparent']}
//         style={styles.headerGradient}
//       >
//         <View style={styles.header}>
//           <Text style={styles.welcomeText}>Find the right professional</Text>
//           <Text style={styles.subtitle}>Connect with trusted professionals and skilled labour</Text>
//           {/* 📍 STATE CHANGE: Pass global state down to LocationPicker */}
//           <LocationPicker 
//             onLocationSelect={handleLocationSelect}
//             currentLocation={selectedLocation}
//             isLoading={isLocationLoading}
//           />
//           <SearchBar onSearch={handleSearch} />
//         </View>
//       </LinearGradient>
      
//       <View style={styles.categoriesContainer}>
//         <Text style={styles.sectionTitle}>Browse Services</Text>
//         <CategoryList
//           activeCategory={activeCategory}
//           onSelectCategory={handleCategorySelect}
//           serviceType={serviceType}
//           onServiceTypeChange={handleServiceTypeChange}
//         />
//       </View>

//       <View style={styles.resultsHeader}>
//         <Text style={styles.resultsTitle}>
//           {serviceType === 'all' ? 'All Services' :
//             serviceType === 'professional' ? 'Professionals' : 'Labour'}
//         </Text>
//         <Text style={styles.resultsCount}>
//           {providers.length} {providers.length === 1 ? 'result' : 'results'}
//         </Text>
//       </View>
//     </>
//   );

//   const renderProvider = ({ item }: { item: ServiceProvider }) => (
//     <View style={styles.cardContainer}>
//       <ProfessionalCard
//         provider={item}
//         onPress={() => handleProviderPress(item)}
//       />
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <FlatList
//         data={providers}
//         renderItem={renderProvider}
//         keyExtractor={(item) => item.id}
//         numColumns={numColumns}
//         key={numColumns}
//         ListHeaderComponent={renderHeader}
//         style={{ opacity: (loading || isLocationLoading) ? 0.7 : 1.0 }} // 📍 STATE CHANGE: Dim if global location is loading
//         ListEmptyComponent={
//           !(loading || isLocationLoading) ? ( // 📍 STATE CHANGE: Check global loading
//             <Text style={styles.emptyText}>
//               {!selectedLocation 
//                  ? 'Please select a location to begin.'
//                 : 'No results found. Try adjusting your filters.'}
//             </Text>
//           ) : null
//         }
//         ListFooterComponent={
//             (loading || isLocationLoading) ? <ActivityIndicator size="large" color={colors.primary[600]} style={{ marginTop: 20 }}/> : null // 📍 STATE CHANGE: Check global loading
//         }
//         contentContainerStyle={styles.listContentContainer}
//       />
//   </SafeAreaView>
//   );
// }

// // Styles remain unchanged
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.white },
//   listContentContainer: { paddingBottom: spacing.xl },
//   headerGradient: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
//   header: { gap: spacing.md, marginTop: spacing.md },
// // ... all your other styles are correct
//   welcomeText: { ...typography.headingLarge, color: colors.gray[900], textAlign: 'center' },
//   subtitle: { ...typography.bodyLarge, color: colors.gray[600], textAlign: 'center', marginBottom: spacing.md },
//   categoriesContainer: { paddingHorizontal: spacing.md, backgroundColor: colors.white, paddingVertical: spacing.sm, marginBottom: spacing.lg },
//   sectionTitle: { ...typography.headingMedium, color: colors.gray[900], marginBottom: spacing.md },
//   resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg, paddingHorizontal: spacing.md },
//   resultsTitle: { ...typography.headingSmall, color: colors.gray[900] },
//   resultsCount: { ...typography.bodyMedium, color: colors.gray[600] },
//   cardContainer: { flex: 1 / (Platform.OS === 'web' && Dimensions.get('window').width > 768 ? 4 : 2), paddingHorizontal: spacing.sm, marginBottom: spacing.md },
//   emptyText: { ...typography.bodyLarge, color: colors.gray[600], textAlign: 'center', width: '100%', marginTop: spacing.xl, lineHeight: 24, paddingHorizontal: spacing.md },
// });





import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { LinearGradient } from 'expo-linear-gradient';
import CategoryList from '@/components/services/CategoryList';
import LocationPicker from '@/components/search/LocationPicker';
import SearchBar from '@/components/search/SearchBar';
import ProfessionalCard from '@/components/services/ProfessionalCard';
import { searchServiceProviders, ServiceProvider } from '@/lib/api';
import { useGlobalLocation } from '../(context)/LocationContext';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [serviceType, setServiceType] = useState<'professional' | 'labour' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const { location: selectedLocation, setLocation: setSelectedLocation, isLoading: isLocationLoading } = useGlobalLocation();
  
  useEffect(() => {
    const fetchProviders = async () => {
      if (!selectedLocation) {
        setProviders([]);
        if(!isLocationLoading) setLoading(false);
        return;
      }
      
      setLoading(true);
      
      const categoryFilter = activeCategory === 'all' ? undefined : activeCategory;
      const queryFilter = searchQuery.trim() === '' ? undefined : searchQuery;

      const data = await searchServiceProviders(
        serviceType,
        queryFilter,
        selectedLocation,
        categoryFilter
      );
      
      setProviders(data);
      setLoading(false);
    };

    fetchProviders();
  }, [serviceType, selectedLocation, activeCategory, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLocationSelect = (location: string | null) => {
    setSelectedLocation(location);
  };

  const handleServiceTypeChange = (type: 'professional' | 'labour' | 'all') => {
    setServiceType(type);
    setActiveCategory('all');
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
  };

  const handleProviderPress = (provider: ServiceProvider) => {
    router.push(`/professional/${provider.id}`);
  };

  const screenWidth = Dimensions.get('window').width;
  const numColumns = Platform.OS === 'web' && screenWidth > 768 ? 4 : 2;

  const renderHeader = () => (
    <>
      <LinearGradient
        colors={[colors.primary[50], 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Find the right professional</Text>
          <Text style={styles.subtitle}>Connect with trusted professionals and skilled labour</Text>
          <LocationPicker 
            onLocationSelect={handleLocationSelect}
            currentLocation={selectedLocation}
            isLoading={isLocationLoading}
          />
          <SearchBar onSearch={handleSearch} />
        </View>
      </LinearGradient>
      
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Browse Services</Text>
        <CategoryList
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          serviceType={serviceType}
          onServiceTypeChange={handleServiceTypeChange}
        />
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {serviceType === 'all' ? 'All Services' :
            serviceType === 'professional' ? 'Professionals' : 'Labour'}
        </Text>
        <Text style={styles.resultsCount}>
          {providers.length} {providers.length === 1 ? 'result' : 'results'}
        </Text>
      </View>
    </>
  );

  const renderProvider = ({ item }: { item: ServiceProvider }) => (
    <View style={styles.cardContainer}>
      <ProfessionalCard
        provider={item}
        onPress={() => handleProviderPress(item)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        ListHeaderComponent={renderHeader}
        style={{ opacity: (loading || isLocationLoading) ? 0.7 : 1.0 }}
        ListEmptyComponent={
          !(loading || isLocationLoading) ? (
            <Text style={styles.emptyText}> 
              {!selectedLocation 
                ? 'Please select a location to begin.'
                : 'No results found. Try adjusting your filters.'} 
            </Text>
          ) : null
        }
        ListFooterComponent={
          (loading || isLocationLoading) ? <ActivityIndicator size="large" color={colors.primary[600]} style={{ marginTop: 20 }}/> : null
        }
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView> 
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  listContentContainer: { paddingBottom: spacing.xl },
  headerGradient: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  header: { gap: spacing.md, marginTop: spacing.md },
  welcomeText: { ...typography.headingLarge, color: colors.gray[900], textAlign: 'center' },
  subtitle: { ...typography.bodyLarge, color: colors.gray[600], textAlign: 'center', marginBottom: spacing.md },
  categoriesContainer: { paddingHorizontal: spacing.md, backgroundColor: colors.white, paddingVertical: spacing.sm, marginBottom: spacing.lg },
  sectionTitle: { ...typography.headingMedium, color: colors.gray[900], marginBottom: spacing.md },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg, paddingHorizontal: spacing.md },
  resultsTitle: { ...typography.headingSmall, color: colors.gray[900] },
  resultsCount: { ...typography.bodyMedium, color: colors.gray[600] },
  cardContainer: { flex: 1 / (Platform.OS === 'web' && Dimensions.get('window').width > 768 ? 4 : 2), paddingHorizontal: spacing.sm, marginBottom: spacing.md },
  emptyText: { ...typography.bodyLarge, color: colors.gray[600], textAlign: 'center', width: '100%', marginTop: spacing.xl, lineHeight: 24, paddingHorizontal: spacing.md },
});