import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { Booking } from '@/types/booking';
import Button from '@/components/common/Button';

interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
  isPro?: boolean;
}

export default function BookingCard({ booking, onPress, isPro = false }: BookingCardProps) {
  const getStatusColor = () => {
    switch (booking.status) {
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

  const getStatusLabel = () => {
    switch (booking.status) {
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
      default:
        return 'Pending';
    }
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

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.serviceInfo}>
          <Image 
            source={{ uri: booking.serviceImage }}
            style={styles.serviceImage}
          />
          <View>
            <Text style={styles.serviceName}>{booking.serviceName}</Text>
            <Text style={styles.provider}>
              {isPro ? `Client: ${booking.clientName}` : `Provider: ${booking.providerName}`}
            </Text>
          </View>
        </View>
        
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: `${getStatusColor()}20` }
          ]}
        >
          <Text 
            style={[
              styles.statusText, 
              { color: getStatusColor() }
            ]}
          >
            {getStatusLabel()}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Calendar size={16} color={colors.gray[600]} />
          <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Clock size={16} color={colors.gray[600]} />
          <Text style={styles.detailText}>{booking.timeSlot}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <MapPin size={16} color={colors.gray[600]} />
          <Text style={styles.detailText}>{booking.location}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.price}>${booking.price.toFixed(2)}</Text>
        
        {booking.status === 'confirmed' && (
          <View style={styles.actions}>
            {isPro ? (
              <Button 
                title="Contact Client" 
                variant="outline" 
                style={styles.actionButton}
              />
            ) : (
              <Button 
                title="Cancel" 
                variant="outline" 
                style={styles.actionButton}
              />
            )}
          </View>
        )}
        
        {booking.status === 'completed' && !isPro && (
          <View style={styles.actions}>
            <Button 
              title="Leave Review" 
              variant="outline" 
              style={styles.actionButton}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  serviceName: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-Medium',
    color: colors.gray[900],
  },
  provider: {
    ...typography.bodySmall,
    color: colors.gray[600],
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  statusText: {
    ...typography.labelSmall,
    fontFamily: 'Inter-Medium',
  },
  details: {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.gray[700],
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...typography.headingSmall,
    color: colors.primary[600],
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: spacing.sm,
  },
});