import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Star, MapPin, DollarSign } from 'lucide-react-native';

export interface Service {
  id: string;
  title: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
}

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
}

export default function ServiceCard({ service, onPress }: ServiceCardProps) {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = Platform.OS === 'web'
    ? screenWidth > 768
      ? (screenWidth - spacing.md * 6) / 3 - spacing.md
      : (screenWidth - spacing.md * 4) / 2 - spacing.md
    : (screenWidth - spacing.md * 3) / 2 - spacing.md;

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: service.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{service.category}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {service.title}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Star size={14} color={colors.warning[500]} fill={colors.warning[500]} />
          <Text style={styles.rating}>{service.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({service.reviewCount})</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={12} color={colors.gray[500]} />
          <Text style={styles.location} numberOfLines={1}>
            {service.location}
          </Text>
        </View>
        
        <View style={styles.priceContainer}>
          <DollarSign size={16} color={colors.primary[600]} />
          <Text style={styles.price}>{service.price}</Text>
          <Text style={styles.priceUnit}>/hr</Text>
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
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    ...typography.labelSmall,
    color: colors.white,
    fontFamily: 'Inter-Medium',
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-Medium',
    color: colors.gray[900],
    height: 42,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rating: {
    ...typography.bodySmall,
    color: colors.gray[800],
    marginLeft: spacing.xs,
    fontFamily: 'Inter-Medium',
  },
  reviewCount: {
    ...typography.bodySmall,
    color: colors.gray[500],
    marginLeft: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  location: {
    ...typography.bodySmall,
    color: colors.gray[600],
    marginLeft: spacing.xs,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    marginTop: spacing.xs,
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