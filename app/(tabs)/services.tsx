// import { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Platform, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { typography } from '@/constants/typography';
// import { colors } from '@/constants/colors';
// import { spacing } from '@/constants/spacing';
// import { Star, Briefcase, MapPin, Clock } from 'lucide-react-native';
// import SearchBar from '@/components/search/SearchBar';
// import ServiceCard from '@/components/services/ServiceCard';
// import ServiceInquiryModal from '@/components/services/ServiceInquiryModal';
// import { searchServices, Service, ServiceFilters } from '@/lib/servicesApi';

// export default function ServicesScreen() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState<ServiceFilters>({
//     category: 'all',
//     location: '',
//     priceRange: 'all',
//     providerType: 'all',
//     tags: [],
//   });
  
//   // Modal state
//   const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
//   const [selectedService, setSelectedService] = useState<Service | null>(null);

//   const fetchServices = async (query?: string, serviceFilters?: ServiceFilters) => {
//     setLoading(true);
//     try {
//       console.log('Fetching services with query:', query, 'filters:', serviceFilters);
//       const data = await searchServices(query, serviceFilters || filters);
//       console.log('Received services data:', data);
//       setServices(data);
//     } catch (error) {
//       console.error('Error fetching services:', error);
//       // Set empty array on error, fallback data is handled in the API function
//       setServices([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServices(searchQuery, filters);
//   }, [filters]);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     fetchServices(query, filters);
//   };

//   const handleServicePress = (service: Service) => {
//     setSelectedService(service);
//     setInquiryModalVisible(true);
//   };

//   const handleCloseInquiryModal = () => {
//     setInquiryModalVisible(false);
//     setSelectedService(null);
//   };

//   const screenWidth = Dimensions.get('window').width;
//   const numColumns = Platform.OS === 'web' && screenWidth > 768 ? 3 : 2;

//   const renderService = ({ item }: { item: Service }) => (
//     <ServiceCard
//       service={{
//         id: item.id,
//         title: item.title,
//         category: item.category,
//         location: item.location,
//         rating: item.providerRating,
//         reviewCount: item.providerReviews,
//         price: item.price,
//         image: item.image,
//       }}
//       onPress={() => handleServicePress(item)}
//     />
//   );

//   const averageRating = services.length > 0 
//     ? (services.reduce((sum, s) => sum + s.providerRating, 0) / services.length).toFixed(1)
//     : '0.0';

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Services</Text>
//         <Text style={styles.subtitle}>Browse available services from our platform</Text>
        
//         <SearchBar onSearch={handleSearch} />

//         <View style={styles.statsContainer}>
//           <View style={styles.statItem}>
//             <Briefcase size={16} color={colors.primary[600]} />
//             <Text style={styles.statText}>
//               {loading ? 'Loading...' : `${services.length} services available`}
//             </Text>
//           </View>
          
//           <View style={styles.statItem}>
//             <Star size={16} color={colors.warning[500]} />
//             <Text style={styles.statText}>
//               {loading ? 'Loading...' : `${averageRating} avg rating`}
//             </Text>
//           </View>
//         </View>
//       </View>
      
//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={colors.primary[600]} />
//           <Text style={styles.loadingText}>Loading services...</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={services}
//           renderItem={renderService}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.content}
//           showsVerticalScrollIndicator={false}
//           numColumns={numColumns}
//           key={numColumns}
//           columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>No services found</Text>
//               <Text style={styles.emptySubtext}>
//                 Try adjusting your search criteria or check back later
//               </Text>
//             </View>
//           }
//         />
//       )}

//       {/* Service Inquiry Modal */}
//       <ServiceInquiryModal
//         visible={inquiryModalVisible}
//         onClose={handleCloseInquiryModal}
//         service={selectedService}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   header: {
//     padding: spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.gray[200],
//     backgroundColor: colors.white,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   title: {
//     ...typography.headingLarge,
//     color: colors.gray[900],
//     marginBottom: spacing.xs,
//   },
//   subtitle: {
//     ...typography.bodyMedium,
//     color: colors.gray[600],
//     marginBottom: spacing.lg,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.lg,
//     marginTop: spacing.sm,
//     paddingTop: spacing.sm,
//     borderTopWidth: 1,
//     borderTopColor: colors.gray[100],
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.xs,
//   },
//   statText: {
//     ...typography.bodySmall,
//     color: colors.gray[700],
//   },
//   content: {
//     padding: spacing.md,
//     flexGrow: 1,
//   },
//   row: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 0,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: spacing.xl,
//   },
//   loadingText: {
//     ...typography.bodyLarge,
//     color: colors.gray[600],
//     marginTop: spacing.md,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: spacing.xl,
//     minHeight: 300,
//   },
//   emptyText: {
//     ...typography.headingMedium,
//     color: colors.gray[800],
//     marginBottom: spacing.sm,
//   },
//   emptySubtext: {
//     ...typography.bodyMedium,
//     color: colors.gray[600],
//     textAlign: 'center',
//   },
// });


// import { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Platform, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { typography } from '@/constants/typography';
// import { colors } from '@/constants/colors';
// import { spacing } from '@/constants/spacing';
// import { Star, Briefcase, MapPin, Clock } from 'lucide-react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import SearchBar from '@/components/search/SearchBar';
// import ServiceCard from '@/components/services/ServiceCard';
// import ServiceInquiryModal from '@/components/services/ServiceInquiryModal';
// import { searchServices, Service, ServiceFilters } from '@/lib/servicesApi';
// import { useGlobalLocation } from '../(context)/LocationContext'; // Import global location hook

// export default function ServicesScreen() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(false); // We'll let the hooks control the main loading
//   const [searchQuery, setSearchQuery] = useState('');

//   // Get location from the global hook
//   const { location: globalLocation, isLoading: isLocationLoading } = useGlobalLocation();

//   const [filters, setFilters] = useState<ServiceFilters>({
//     category: 'all',
//     location: globalLocation || '', // Initialize with global location
//     priceRange: 'all',
//     providerType: 'all',
//     tags: [],
//   });
  
//   // Modal state
//   const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
//   const [selectedService, setSelectedService] = useState<Service | null>(null);

//   // This effect syncs the global location with the service filters
//   useEffect(() => {
//     if (globalLocation && globalLocation !== filters.location) {
//       setFilters(prev => ({ ...prev, location: globalLocation }));
//     } else if (!globalLocation && filters.location) {
//       setFilters(prev => ({ ...prev, location: '' }));
//     }
//   }, [globalLocation]);

//   useEffect(() => {
//     // Only fetch if a location is set
//     if (filters.location) {
//       fetchServices(searchQuery, filters);
//     } else {
//       // No location, clear services
//       setServices([]);
//     }
//   }, [filters]); // Runs when filters (including location) change

//   const fetchServices = async (query?: string, serviceFilters?: ServiceFilters) => {
//     setLoading(true);
//     try {
//       const data = await searchServices(query, serviceFilters || filters);
//       setServices(data);
//     } catch (error) {
//       console.error('Error fetching services:', error);
//       setServices([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     // Only fetch if a location is set
//     if (filters.location) {
//       fetchServices(query, filters);
//     }
//   };

//   const handleServicePress = (service: Service) => {
//     setSelectedService(service);
//     setInquiryModalVisible(true);
//   };

//   const handleCloseInquiryModal = () => {
//     setInquiryModalVisible(false);
//     setSelectedService(null);
//   };

//   const screenWidth = Dimensions.get('window').width;
//   const numColumns = Platform.OS === 'web' && screenWidth > 768 ? 3 : 2;

//   const renderService = ({ item }: { item: Service }) => (
//     <ServiceCard
//       service={{
//         id: item.id,
//         title: item.title,
//         category: item.category,
//         location: item.location,
//         rating: item.providerRating,
//         reviewCount: item.providerReviews,
//         price: item.price,
//         image: item.image,
//       }}
//       onPress={() => handleServicePress(item)}
//     />
//   );

//   const averageRating = services.length > 0 
//     ? (services.reduce((sum, s) => sum + s.providerRating, 0) / services.length).toFixed(1)
//     : '0.0';
  
//   // Combine both loading states for the UI
//   const isAppLoading = loading || isLocationLoading;

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <LinearGradient
//         colors={[colors.primary[50], colors.white]}
//         style={styles.header}
//       >
//         <Text style={styles.title}>Services</Text>
//         <Text style={styles.subtitle}>Browse available services in your area</Text>
        
//         <SearchBar onSearch={handleSearch} placeholder="Search services..." />

//         <View style={styles.statsContainer}>
//           <View style={styles.statItem}>
//             <Briefcase size={16} color={colors.primary[600]} />
//             <Text style={styles.statText}>
//               {isAppLoading ? 'Loading...' : `${services.length} services`}
//             </Text>
//           </View>
          
//           <View style={styles.statItem}>
//             <MapPin size={16} color={colors.gray[600]} />
//             <Text style={styles.statText}>
//               {isAppLoading ? '...' : filters.location || 'All Locations'}
//             </Text>
//           </View>

//           <View style={styles.statItem}>
//             <Star size={16} color={colors.warning[500]} />
//             <Text style={styles.statText}>
//               {isAppLoading ? '...' : `${averageRating} avg rating`}
//             </Text>
//           </View>
//         </View>
//       </LinearGradient>
      
//       {/* ## SCROLL FIX: ##
//         Remove the ternary wrapper. Render the FlatList immediately.
//         The loading logic is now inside ListEmptyComponent.
//       */}
//       <FlatList
//         data={services}
//         renderItem={renderService}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//          numColumns={numColumns}
//         key={numColumns}
//         columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
//         ListEmptyComponent={
//           // ## SCROLL FIX: ##
//           // Show ActivityIndicator if loading, OR the "No services" message if not.
//           isAppLoading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color={colors.primary[600]} />
//               <Text style={styles.loadingText}>
//                   {isLocationLoading ? 'Finding your location...' : 'Loading services...'}
//                 </Text>
//             </View>
//           ) : (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>
//                 {!filters.location ? "Please select a location" : "No services found"}
//               </Text>
//               <Text style={styles.emptySubtext}>
//                 {!filters.location ? "Change your location on the Home screen to see services." : "Try adjusting your search criteria."}
//               </Text>
//             </View>
//           )
//         }
//        />

//       {/* Service Inquiry Modal */}
//       <ServiceInquiryModal
//         visible={inquiryModalVisible}
//         onClose={handleCloseInquiryModal}
//         service={selectedService}
//       />
//     </SafeAreaView>
//   );   



// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   header: {
//     padding: spacing.md,
//     backgroundColor: colors.white,
//   },
//   title: {
//     ...typography.headingLarge,
//     color: colors.gray[900],
//     marginBottom: spacing.xs,
//   },
//   subtitle: {
//     ...typography.bodyMedium,
//     color: colors.gray[600],
//     marginBottom: spacing.lg,
//   }, // <-- This was the line with the syntax error
//   statsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     gap: spacing.md,
//     marginTop: spacing.sm,
//     paddingTop: spacing.sm,
//     borderTopWidth: 1,
//     borderTopColor: colors.gray[100],
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.xs,
//     backgroundColor: colors.white,
//     paddingVertical: spacing.xs,
//     paddingHorizontal: spacing.sm,
//     borderRadius: 8,
//   },
//   statText: {
//     ...typography.bodySmall,
//     color: colors.gray[700],
//   },
//   content: {
//     padding: spacing.md,
//     flexGrow: 1,
//   },
//   row: {
//     justifyContent: 'space-between',
//     paddingHorizontal: 0,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: spacing.xl,
//     minHeight: 300, // Ensure it takes up space
//   },
//   loadingText: {
//     ...typography.bodyLarge,
//     color: colors.gray[600],
//     marginTop: spacing.md,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: spacing.xl,
//     minHeight: 300,
//   },
//   emptyText: {
//     ...typography.headingMedium,
//     color: colors.gray[800],
//     marginBottom: spacing.sm,
//   },
//   emptySubtext: {
//     ...typography.bodyMedium,
//     color: colors.gray[600],
//     textAlign: 'center',
//   },
// });

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Star,
  Briefcase,
  MapPin,
  MapPinOff,
  PackageSearch,
} from 'lucide-react-native';

import SearchBar from '@/components/search/SearchBar';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceInquiryModal from '@/components/services/ServiceInquiryModal';
import { searchServices, Service, ServiceFilters } from '@/lib/servicesApi';
import { useGlobalLocation } from '../(context)/LocationContext';

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { location: globalLocation, isLoading: isLocationLoading } = useGlobalLocation();

  const [filters, setFilters] = useState<ServiceFilters>({
    category: 'all',
    location: globalLocation || '',
    priceRange: 'all',
    providerType: 'all',
    tags: [],
  });

  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Sync global location
  useEffect(() => {
    if (globalLocation && globalLocation !== filters.location) {
      setFilters(prev => ({ ...prev, location: globalLocation }));
    }
  }, [globalLocation]);

  // Fetch services when filters update
  useEffect(() => {
    if (filters.location) {
      fetchServices(searchQuery, filters);
    } else {
      setServices([]);
    }
  }, [filters]);

  // Fetch from backend
  const fetchServices = async (query?: string, serviceFilters?: ServiceFilters) => {
    setLoading(true);

    try {
      const data = await searchServices(query, serviceFilters || filters);
      setServices(data);

      // 🟩 Filter by location (FRONTEND)
      applyLocationFilter(data, serviceFilters?.location || filters.location);

    } catch (error) {
      console.log('Error fetching services:', error);
      setServices([]);
      setFilteredServices([]);
    }

    setLoading(false);
  };

  // 🟩 REAL FRONTEND FILTER LOGIC
  const applyLocationFilter = (data: Service[], location: string) => {
    if (!location) {
      setFilteredServices(data);
      return;
    }

    const final = data.filter(s =>
      s.location?.toLowerCase().includes(location.toLowerCase())
    );

    setFilteredServices(final);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchServices(query, filters);
  };

  const handleServicePress = (service: Service) => {
    setSelectedService(service);
    setInquiryModalVisible(true);
  };

  const handleCloseInquiryModal = () => {
    setSelectedService(null);
    setInquiryModalVisible(false);
  };

  const screenWidth = Dimensions.get('window').width;
  const numColumns = Platform.OS === 'web' && screenWidth > 768 ? 3 : 2;

  const renderService = ({ item }: { item: Service }) => (
    <ServiceCard
      service={{
        id: item.id,
        title: item.title,
        category: item.category,
        location: item.location,
        rating: item.providerRating,
        reviewCount: item.providerReviews,
        price: item.price,
        image: item.image,
      }}
      onPress={() => handleServicePress(item)}
    />
  );

  const averageRating =
    filteredServices.length > 0
      ? (
          filteredServices.reduce((sum, s) => sum + s.providerRating, 0) /
          filteredServices.length
        ).toFixed(1)
      : '0.0';

  const isAppLoading = loading || isLocationLoading;

  const renderListHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Briefcase size={16} color={colors.primary[600]} />
        <Text style={styles.statText}>{filteredServices.length} services</Text>
      </View>

      <View style={styles.statItem}>
        <MapPin size={16} color={colors.gray[600]} />
        <Text style={styles.statText}>
          {filters.location || 'All Locations'}
        </Text>
      </View>

      <View style={styles.statItem}>
        <Star size={16} color={colors.warning[500]} />
        <Text style={styles.statText}>{averageRating} avg rating</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary[100], colors.white]}
        style={styles.header}
      >
        <Text style={styles.title}>Services</Text>
        <Text style={styles.subtitle}>Browse services near you</Text>

        <SearchBar onSearch={handleSearch} placeholder="Search services..." />
      </LinearGradient>

      <FlatList
        data={filteredServices}
        renderItem={renderService}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.content}
        numColumns={numColumns}
        key={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        ListEmptyComponent={
          isAppLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary[600]} />
              <Text style={styles.loadingText}>Loading services...</Text>
            </View>
          ) : !filters.location ? (
            <View style={styles.emptyContainer}>
              <MapPinOff size={48} color={colors.gray[400]} />
              <Text style={styles.emptyText}>Please select a location</Text>
              <Text style={styles.emptySubtext}>
                Set your location on the Home screen to view services.
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <PackageSearch size={48} color={colors.gray[400]} />
              <Text style={styles.emptyText}>No services found</Text>
              <Text style={styles.emptySubtext}>
                Try changing your filters or search query.
              </Text>
            </View>
          )
        }
      />

      <ServiceInquiryModal
        visible={inquiryModalVisible}
        onClose={handleCloseInquiryModal}
        service={selectedService}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  title: {
    ...typography.headingLarge,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },

  subtitle: {
    ...typography.bodyMedium,
    color: colors.gray[600],
    marginBottom: spacing.lg,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    marginRight: spacing.sm,
  },

  statText: {
    ...typography.bodySmall,
    marginLeft: 5,
    fontWeight: '600',
    color: colors.gray[700],
  },

  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },

  row: { justifyContent: 'space-between' },

  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    minHeight: 300,
  },

  loadingText: {
    ...typography.bodyLarge,
    color: colors.gray[600],
    marginTop: spacing.md,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 300,
  },

  emptyText: {
    ...typography.headingMedium,
    color: colors.gray[800],
  },

  emptySubtext: {
    ...typography.bodyMedium,
    color: colors.gray[600],
    textAlign: 'center',
  },
});
