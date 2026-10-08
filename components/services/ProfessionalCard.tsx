import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Star, MapPin, Clock, DollarSign, Shield } from 'lucide-react-native';
import { ServiceProvider } from '@/lib/api';

interface ProfessionalCardProps {
  provider: ServiceProvider;
  onPress?: () => void;
}

export default function ProfessionalCard({ provider, onPress }: ProfessionalCardProps) {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = Platform.OS === 'web'
    ? screenWidth > 768
      ? (screenWidth - spacing.md * 6) / 4 - spacing.md
      : (screenWidth - spacing.md * 4) / 2 - spacing.md
    : (screenWidth - spacing.md * 3) / 2 - spacing.md;

  const isLabour = 'category' in provider;
  const categoryOrProfession = isLabour ? provider.category : provider.profession;
  const rate = isLabour ? provider.daily_rate : provider.hourly_rate;
  const rateUnit = isLabour ? '/day' : '/hr';

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Image Container with Overlay */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: provider.avatar }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        <View style={styles.imageOverlay}>
          {provider.is_verified && (
            <View style={styles.verifiedBadge}>
              <Shield size={12} color={colors.white} />
            </View>
          )}
          <View style={styles.availabilityBadge}>
            <View style={[
              styles.availabilityDot, 
              { backgroundColor: provider.availability === 'Available' ? colors.success[500] : colors.warning[500] }
            ]} />
            <Text style={styles.availabilityText}>{provider.availability}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {provider.business_name || provider.name}
          </Text>
          <View style={styles.typeIndicator}>
            <Text style={styles.typeText}>
              {isLabour ? 'L' : 'P'}
            </Text>
          </View>
        </View>
        
        {/* Category */}
        <Text style={styles.category} numberOfLines={1}>
          {categoryOrProfession}
        </Text>
        
        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingContainer}>
            <Star size={12} color={colors.warning[500]} fill={colors.warning[500]} />
            <Text style={styles.rating}>{provider.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.reviewCount}>({provider.reviews || 0})</Text>
        </View>
        
        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <MapPin size={10} color={colors.gray[500]} />
            <Text style={styles.detailText} numberOfLines={1}>
              {provider.location}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={10} color={colors.gray[500]} />
            <Text style={styles.detailText}>
              {provider.years_of_experience}y exp
            </Text>
          </View>
        </View>
        
        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <DollarSign size={14} color={colors.primary[600]} />
            <Text style={styles.price}>{rate}</Text>
            <Text style={styles.priceUnit}>{rateUnit}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.gray[100],
    transform: [{ scale: 1 }],
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[100],
  },
  imageOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  verifiedBadge: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  availabilityText: {
    ...typography.labelSmall,
    color: colors.gray[700],
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-Medium',
    color: colors.gray[900],
    flex: 1,
    marginRight: spacing.xs,
  },
  typeIndicator: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: {
    ...typography.labelSmall,
    color: colors.gray[600],
    fontSize: 9,
    fontFamily: 'Inter-Bold',
  },
  category: {
    ...typography.labelMedium,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    ...typography.bodySmall,
    color: colors.gray[800],
    fontFamily: 'Inter-Medium',
  },
  reviewCount: {
    ...typography.bodySmall,
    color: colors.gray[500],
    fontSize: 11,
  },
  detailsSection: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.gray[600],
    flex: 1,
    fontSize: 11,
  },
  priceSection: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingTop: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
  },
  price: {
    ...typography.labelLarge,
    color: colors.primary[700],
    fontFamily: 'Inter-Bold',
    marginLeft: 2,
  },
  priceUnit: {
    ...typography.bodySmall,
    color: colors.primary[600],
    marginLeft: 2,
  },
});