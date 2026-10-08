// import { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { typography } from '@/constants/typography';
// import { colors } from '@/constants/colors';
// import { spacing } from '@/constants/spacing';
// import { Filter, MapPin, Briefcase } from 'lucide-react-native';
// import SearchBar from '@/components/search/SearchBar';
// import JobCard from '@/components/jobs/JobCard';
// import JobFilters from '@/components/jobs/JobFilters';
// import JobApplicationModal from '@/components/jobs/JobApplicationModal';
// import { searchJobs, Job, JobFilters as JobFiltersType } from '@/lib/jobsApi';
// import { useLocation } from '@/hooks/useLocation'; // ## FIX 1: Import the useLocation hook ##

// export default function JobsScreen() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true); // Start loading initially
//   const [showFilters, setShowFilters] = useState(false);
//   const [showApplicationModal, setShowApplicationModal] = useState(false);
//   const [selectedJob, setSelectedJob] = useState<Job | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState<JobFiltersType>({
//     location: '', // Start with an empty location
//     jobType: 'all',
//     experienceLevel: 'all',
//     education: 'all',
//     salaryRange: 'all',
//     category: 'all',
//     workMode: 'all',
//     postedWithin: 'all',
//   });

//   // ## FIX 2: Use the location hook to get the device's location ##
//   const locationData = useLocation();
//   const deviceLocation = locationData?.location;

//   // ## FIX 3: Add a useEffect to set the initial location filter ##
//   useEffect(() => {
//     // Only set the location if we have found one and if a filter isn't already set
//     if (deviceLocation && !filters.location) {
//       setFilters(prevFilters => ({
//         ...prevFilters,
//         location: deviceLocation,
//       }));
//     }
//   }, [deviceLocation]); // This runs when the device's location is found

//   // This useEffect now fetches jobs whenever filters OR the search query change
//   useEffect(() => {
//     // We only fetch if a location filter has been set (either automatically or manually)
//     if (filters.location) {
//       fetchJobs();
//     }
//   }, [filters, searchQuery]);

//   const fetchJobs = async () => {
//     setLoading(true);
//     try {
//       const data = await searchJobs(searchQuery, filters);
//       setJobs(data);
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     // The main useEffect will automatically re-fetch
//   };

//   const handleApplyFilters = (newFilters: JobFiltersType) => {
//     setFilters(newFilters);
//     setShowFilters(false);
//   };

//   const getActiveFiltersCount = () => {
//     return Object.values(filters).filter(value => value !== 'all' && value !== '').length;
//   };

//   const handleJobApply = (jobId: string) => {
//     const job = jobs.find(j => j.id === jobId);
//     if (job) {
//       setSelectedJob(job);
//       setShowApplicationModal(true);
//     }
//   };

//   const handleCloseApplicationModal = () => {
//     setShowApplicationModal(false);
//     setSelectedJob(null);
//   };
  
//   const renderHeader = () => (
//     <View style={styles.header}>
//         <Text style={styles.title}>Find Jobs</Text>
//         <Text style={styles.subtitle}>Discover opportunities that match your skills</Text>
        
//         <View style={styles.searchContainer}>
//           <SearchBar onSearch={handleSearch} />
          
//           <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
//             <Filter size={20} color={colors.primary[600]} />
//             {getActiveFiltersCount() > 0 && (
//               <View style={styles.filterBadge}>
//                 <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         <View style={styles.statsContainer}>
//           <View style={styles.statItem}>
//             <Briefcase size={16} color={colors.primary[600]} />
//             <Text style={styles.statText}>{jobs.length} jobs found</Text>
//           </View>
          
//           {filters.location ? (
//             <View style={styles.statItem}>
//               <MapPin size={16} color={colors.gray[600]} />
//               <Text style={styles.statText}>{filters.location}</Text>
//             </View>
//           ) : (
//             <View style={styles.statItem}>
//               <MapPin size={16} color={colors.gray[600]} />
//               <Text style={styles.statText}>All Locations</Text>
//             </View>
//           )}
//         </View>
//       </View>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <FlatList
//         data={jobs}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <JobCard
//             job={item}
//             onApply={handleJobApply}
//             onPress={() => console.log('Navigate to job:', item.id)}
//           />
//         )}
//         ListHeaderComponent={renderHeader}
//         ListEmptyComponent={
//           loading ? (
//             <ActivityIndicator size="large" color={colors.primary[600]} style={{ marginTop: 40 }}/>
//           ) : (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>No Jobs Found</Text>
//               <Text style={styles.emptySubtext}>Try adjusting your search or filters.</Text>
//             </View>
//           )
//         }
//         contentContainerStyle={styles.content}
//       />

//       <Modal
//         visible={showFilters}
//         animationType="slide"
//         presentationStyle="pageSheet"
//         onRequestClose={() => setShowFilters(false)}
//       >
//         <JobFilters
//           filters={filters}
//           onApplyFilters={handleApplyFilters}
//           onClose={() => setShowFilters(false)}
//         />
//       </Modal>

//       <JobApplicationModal
//         visible={showApplicationModal}
//         onClose={handleCloseApplicationModal}
//         job={selectedJob}
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
//     borderBottomWidth: 1,
//     borderBottomColor: colors.gray[200],
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
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.sm,
//     marginBottom: spacing.md,
//   },
//   filterButton: {
//     width: 48,
//     height: 48,
//    borderRadius: 12,
//     backgroundColor: colors.primary[50],
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   filterBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     backgroundColor: colors.error[500],
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   filterBadgeText: {
//     ...typography.labelSmall,
//     color: colors.white,
//     fontSize: 10,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.md,
//   },
//   statItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.xs,
//   },
//   statText: {
//     ...typography.bodySmall,
//     color: colors.gray[700],
//   },
//   content: {
//     padding: spacing.md,
//     flexGrow: 1,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: spacing.xl,
//   },
//   emptyText: {
//   	...typography.headingMedium,
//   	color: colors.gray[800],
//   	marginBottom: spacing.sm,
//   },
//   emptySubtext: {
//     ...typography.bodyMedium,
//     color: colors.gray[600],
//     textAlign: 'center',
//   },
// });








import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Filter, MapPin, Briefcase } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient'; // 🎨 UI UPDATE: Import gradient
import SearchBar from '@/components/search/SearchBar';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import JobApplicationModal from '@/components/jobs/JobApplicationModal';
import { searchJobs, Job, JobFilters as JobFiltersType } from '@/lib/jobsApi';
// 📍 STATE CHANGE: We no longer need the local useLocation hook
// import { useLocation } from '@/hooks/useLocation'; 
import { useGlobalLocation } from '../(context)/LocationContext'; // 📍 STATE CHANGE: Import global hook

export default function JobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false); // We'll set loading in fetchJobs
  const [showFilters, setShowFilters] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 📍 STATE CHANGE: Get location from the global hook
  const { location: globalLocation, isLoading: isLocationLoading } = useGlobalLocation();

  const [filters, setFilters] = useState<JobFiltersType>({
    location: globalLocation || '', // Set initial location from global state
    jobType: 'all',
    experienceLevel: 'all',
    education: 'all',
    salaryRange: 'all',
    category: 'all',
    workMode: 'all',
    postedWithin: 'all',
  });

  // 📍 STATE CHANGE: This effect syncs the global location with the job filters
  useEffect(() => {
    // If the global location changes, update the filters
    if (globalLocation && globalLocation !== filters.location) {
      setFilters(prevFilters => ({
        ...prevFilters,
        location: globalLocation,
      }));
    } else if (!globalLocation && filters.location) {
      // Handle case where global location is cleared
      setFilters(prevFilters => ({
        ...prevFilters,
        location: '',
      }));
    }
  }, [globalLocation]); // Run whenever the global location changes

  // This useEffect now fetches jobs whenever filters OR the search query change
  useEffect(() => {
    // We only fetch if a location filter has been set (either from global or manually)
    if (filters.location) {
      fetchJobs();
    } else {
      // No location selected, clear jobs
      setJobs([]);
      setLoading(isLocationLoading); // Show spinner if global location is still loading
    }
  }, [filters, searchQuery]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await searchJobs(searchQuery, filters);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApplyFilters = (newFilters: JobFiltersType) => {
    // When applying filters, we update the state
    // This will *not* override the global location,
    // as JobFilters component should ideally get 'location' as a read-only prop
    setFilters(newFilters);
    setShowFilters(false);
  };

  const getActiveFiltersCount = () => {
    // Don't count 'location' as an "active filter" if it's just the default
    return Object.entries(filters).filter(
      ([key, value]) => value !== 'all' && value !== '' && key !== 'location'
    ).length;
  };

  const handleJobApply = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setShowApplicationModal(true);
    }
  };

  const handleCloseApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedJob(null);
  };
  
  // 🎨 UI UPDATE: Modified renderHeader
  const renderHeader = () => (
    <LinearGradient
      colors={[colors.primary[50], colors.white]}
      style={styles.header}
    >
      <Text style={styles.title}>Find Jobs</Text>
      <Text style={styles.subtitle}>Discover opportunities that match your skills</Text>
        
      <View style={styles.searchContainer}>
        <SearchBar onSearch={handleSearch} placeholder="Search jobs by title or skill..." />
        
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Filter size={20} color={colors.primary[600]} />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Briefcase size={16} color={colors.primary[600]} />
          <Text style={styles.statText}>{loading ? '...' : jobs.length} jobs found</Text>
        </View>
        
        {filters.location ? (
          <View style={styles.statItem}>
            <MapPin size={16} color={colors.gray[600]} />
            <Text style={styles.statText}>{filters.location}</Text>
          </View>
        ) : (
          <View style={styles.statItem}>
            <MapPin size={16} color={colors.gray[600]} />
            <Text style={styles.statText}>All Locations</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onApply={handleJobApply}
            onPress={() => console.log('Navigate to job:', item.id)} // You can change this to use router.push
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          (loading || isLocationLoading) ? ( // Show loader if jobs or initial location is loading
            <ActivityIndicator size="large" color={colors.primary[600]} style={{ marginTop: 40 }}/>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {!filters.location ? "Select a location to start" : "No Jobs Found"}
              </Text>
              <Text style={styles.emptySubtext}>
                {!filters.location ? "Your location from the Home screen will be used here." : "Try adjusting your search or filters."}
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.content}
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        {/* Pass the global location to the filters modal */}
        <JobFilters
          filters={{...filters, location: globalLocation || ''}} 
          onApplyFilters={handleApplyFilters}
          onClose={() => setShowFilters(false)}
        />
      </Modal>

      <JobApplicationModal
        visible={showApplicationModal}
        onClose={handleCloseApplicationModal}
        job={selectedJob}
      />
    </SafeAreaView>
  );
}

// 🎨 UI UPDATE: Modified styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: spacing.md,
    paddingBottom: spacing.lg, // Add more padding for the gradient
    // No more border, the gradient separates it
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterButton: {
    width: 48,
    height: 48,
   borderRadius: 12,
    backgroundColor: colors.white, // Changed from primary[50] to white for contrast on gradient
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error[500],
   borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    ...typography.labelSmall,
    color: colors.white,
    fontSize: 10,
  },
  statsContainer: {
    flexDirection: 'row',
   alignItems: 'center',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white, // Add a slight background
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  statText: {
    ...typography.bodySmall,
    color: colors.gray[700],
  },
  content: {
    padding: spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: 40,
  },
  emptyText: {
  	...typography.headingMedium,
  	color: colors.gray[800],
  	marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.bodyMedium,
    color: colors.gray[600],
    textAlign: 'center',
  },
});
