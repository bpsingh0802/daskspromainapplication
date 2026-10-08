import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Calendar, Clock, MapPin, User, Star } from 'lucide-react-native';
import { getUserBookings } from '@/lib/professionalApi';

interface Booking {
  Booking_id: string;
  service: string;
  booking_date: string;
  time_slot: string;
  full_name: string;
  status: string;
  created_at: string;
  professional_profiles: {
    business_name: string;
    profession: string;
    avatar: string;
    location: string;
  };
}

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching user bookings...');
      const data = await getUserBookings();
      console.log('Fetched bookings:', data);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return colors.primary[600];
      case 'completed':
        return colors.success[600];
      case 'cancelled':
        return colors.error[600];
      case 'pending':
      default:
        return colors.warning[600];
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isUpcoming = (dateString: string) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  };

  const filteredBookings = bookings.filter(booking => 
    activeTab === 'upcoming' ? isUpcoming(booking.booking_date) : !isUpcoming(booking.booking_date)
  );

  const renderBooking = ({ item }: { item: Booking }) => (
    <TouchableOpacity 
      style={styles.bookingCard}
      activeOpacity={0.9}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.service}</Text>
          <Text style={styles.professionalName}>
            {item.professional_profiles.business_name}
          </Text>
          <Text style={styles.profession}>
            {item.professional_profiles.profession}
          </Text>
        </View>
        
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: `${getStatusColor(item.status)}20` }
          ]}
        >
          <Text 
            style={[
              styles.statusText, 
              { color: getStatusColor(item.status) }
            ]}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={colors.gray[600]} />
          <Text style={styles.detailText}>{formatDate(item.booking_date)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color={colors.gray[600]} />
          <Text style={styles.detailText}>{item.time_slot}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MapPin size={16} color={colors.gray[600]} />
          <Text style={styles.detailText}>{item.professional_profiles.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <User size={16} color={colors.gray[600]} />
          <Text style={styles.detailText}>Client: {item.full_name}</Text>
        </View>
      </View>
      
      <View style={styles.bookingFooter}>
        <Text style={styles.bookingId}>
          Booking ID: {item.Booking_id.slice(0, 8)}...
        </Text>
        <Text style={styles.createdDate}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'upcoming' && styles.activeTabText
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'past' && styles.activeTabText
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.Booking_id}
        renderItem={renderBooking}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading 
                ? "Loading bookings..." 
                : activeTab === 'upcoming' 
                  ? "You don't have any upcoming bookings" 
                  : "You don't have any past bookings"}
            </Text>
            {!loading && (
              <Text style={styles.emptySubtext}>
                Book a service to see your appointments here
              </Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    ...typography.headingLarge,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  tabText: {
    ...typography.labelMedium,
    color: colors.gray[600],
  },
  activeTabText: {
    color: colors.primary[600],
    fontFamily: 'Inter-Medium',
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  bookingCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  serviceInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  serviceName: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-Medium',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  professionalName: {
    ...typography.bodyMedium,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  profession: {
    ...typography.bodySmall,
    color: colors.gray[600],
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  statusText: {
    ...typography.labelSmall,
    fontFamily: 'Inter-Medium',
  },
  bookingDetails: {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.gray[700],
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  bookingId: {
    ...typography.bodySmall,
    color: colors.gray[500],
    fontFamily: 'Inter-Medium',
  },
  createdDate: {
    ...typography.bodySmall,
    color: colors.gray[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 300,
  },
  emptyText: {
    ...typography.bodyLarge,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.bodyMedium,
    color: colors.gray[400],
    textAlign: 'center',
  },
});