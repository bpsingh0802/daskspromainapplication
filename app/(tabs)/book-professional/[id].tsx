import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { ChevronLeft, Calendar, Clock, User, MessageSquare } from 'lucide-react-native';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import DateSelector from '@/components/bookings/DateSelector';
import TimeSlots from '@/components/bookings/TimeSlots';
import { getProfessionalById, createBooking, ProfessionalDetail } from '@/lib/professionalApi';

export default function BookProfessionalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [professional, setProfessional] = useState<ProfessionalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Booking form state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      fetchProfessional();
    }
  }, [id]);

  const fetchProfessional = async () => {
    try {
      setLoading(true);
      const data = await getProfessionalById(id);
      setProfessional(data);
      if (data) {
        setService(data.profession || '');
      }
    } catch (error) {
      console.error('Error fetching professional:', error);
      Alert.alert('Error', 'Failed to load professional details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async () => {
    if (!professional || !selectedTimeSlot || !fullName.trim() || !service.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields and select a time slot.');
      return;
    }
    
    setBookingLoading(true);
    
    try {
      console.log('Preparing booking data...');
      
      const bookingData = {
        professional_id: professional.id,
        service: service.trim(),
        booking_date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
        time_slot: selectedTimeSlot,
        full_name: fullName.trim(),
        notes: notes.trim() || undefined,
      };

      console.log('Booking data to submit:', bookingData);

      const result = await createBooking(bookingData);
      
      console.log('Booking result:', result);
      
      if (result.success) {
        Alert.alert(
          'Booking Confirmed!', 
          `Your booking has been submitted successfully! Booking ID: ${result.bookingId?.slice(0, 8)}... The professional will contact you soon.`,
          [
            {
              text: 'OK',
              onPress: () => router.push('/bookings')
            }
          ]
        );
      } else {
        Alert.alert('Booking Failed', result.error || 'An error occurred while creating your booking.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading booking details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!professional) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Professional not found</Text>
          <Button 
            title="Go Back" 
            variant="primary" 
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const totalCost = professional.hourly_rate;
  const platformFee = totalCost * 0.05;
  const finalTotal = totalCost + platformFee;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Professional Info Card */}
        <View style={styles.professionalCard}>
          <Text style={styles.professionalName}>{professional.business_name}</Text>
          <Text style={styles.professionalProfession}>{professional.profession}</Text>
          <View style={styles.professionalDetails}>
            <View style={styles.detailItem}>
              <Calendar size={16} color={colors.gray[600]} />
              <Text style={styles.detailText}>{professional.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={16} color={colors.gray[600]} />
              <Text style={styles.detailText}>${professional.hourly_rate}/hour</Text>
            </View>
          </View>
        </View>
        
        {/* Booking Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Information</Text>
          <Input
            label="Full Name *"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />
          
          <Input
            label="Service Required *"
            value={service}
            onChangeText={setService}
            placeholder="Describe the service you need"
            multiline
            numberOfLines={2}
          />
          
          <Input
            label="Additional Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requirements or notes..."
            multiline
            numberOfLines={3}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <DateSelector 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <TimeSlots 
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={setSelectedTimeSlot}
          />
        </View>
        
        {/* Booking Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Professional</Text>
              <Text style={styles.summaryValue}>{professional.business_name}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service</Text>
              <Text style={styles.summaryValue}>{service || 'Not specified'}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{selectedTimeSlot || 'Not selected'}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Client</Text>
              <Text style={styles.summaryValue}>{fullName || 'Not provided'}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hourly Rate</Text>
              <Text style={styles.summaryValue}>${professional.hourly_rate.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Platform Fee (5%)</Text>
              <Text style={styles.summaryValue}>${platformFee.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>
                ${finalTotal.toFixed(2)}
              </Text>
            </View>
            
            <Text style={styles.estimateNote}>
              * Final cost will be calculated based on actual hours worked
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title={bookingLoading ? "Creating Booking..." : "Confirm Booking"}
          variant="primary"
          onPress={handleBookService}
          disabled={!selectedTimeSlot || !fullName.trim() || !service.trim() || bookingLoading}
          loading={bookingLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.headingMedium,
    color: colors.gray[900],
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: spacing.md,
  },
  professionalCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  professionalName: {
    ...typography.headingMedium,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  professionalProfession: {
    ...typography.bodyMedium,
    color: colors.primary[600],
    marginBottom: spacing.sm,
  },
  professionalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    ...typography.bodyMedium,
    color: colors.gray[700],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.bodyMedium,
    color: colors.gray[600],
  },
  summaryValue: {
    ...typography.bodyMedium,
    color: colors.gray[900],
    fontFamily: 'Inter-Medium',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.md,
  },
  totalLabel: {
    ...typography.bodyLarge,
    color: colors.gray[900],
    fontFamily: 'Inter-Bold',
  },
  totalValue: {
    ...typography.headingMedium,
    color: colors.primary[600],
  },
  estimateNote: {
    ...typography.bodySmall,
    color: colors.gray[500],
    fontStyle: 'italic',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.bodyLarge,
    color: colors.gray[600],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.headingMedium,
    color: colors.gray[800],
    marginBottom: spacing.lg,
  },
  errorButton: {
    width: 200,
  },
});