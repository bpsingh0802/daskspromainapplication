import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { 
  Users, 
  Wrench, 
  Paintbrush, 
  Car, 
  Shirt, 
  HeartPulse, 
  Laptop, 
  BookOpen, 
  MoveHorizontal as MoreHorizontal,
  HardHat,
  Hammer,
  Building
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface CategoryListProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  serviceType: 'professional' | 'labour' | 'all';
  onServiceTypeChange: (type: 'professional' | 'labour' | 'all') => void;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

const iconMap: { [key: string]: React.ComponentType<{ size: number; color: string }> } = {
  all: MoreHorizontal,
  cleaning: Shirt,
  handyman: Wrench,
  painting: Paintbrush,
  automotive: Car,
  healthcare: HeartPulse,
  tech: Laptop,
  tutoring: BookOpen,
  construction: HardHat,
  electrical: Hammer,
  plumbing: Wrench,
  carpentry: Building,
  masonry: HardHat,
  roofing: Building,
  landscaping: Hammer,
};

export default function CategoryList({ 
  activeCategory, 
  onSelectCategory, 
  serviceType, 
  onServiceTypeChange 
}: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let fetchedCategories: Category[] = [{ id: 'all', name: 'All', icon: MoreHorizontal }];

        if (serviceType === 'all') {
          const [professionalResponse, labourResponse] = await Promise.all([
            supabase
              .from('professional_profiles')
              .select('profession')
              .not('profession', 'is', null),
            supabase
              .from('labour_profiles')
              .select('category')
              .not('category', 'is', null),
          ]);

          if (professionalResponse.error || labourResponse.error) {
            console.error('Supabase error:', professionalResponse.error || labourResponse.error);
            setError('Failed to fetch categories');
            return;
          }

          const professionalCategories = Array.from(
            new Set(
              professionalResponse.data
                ?.map((item) => item.profession?.trim())
                .filter((prof): prof is string => !!prof)
            )
          ).map((profession) => ({
            id: profession.toLowerCase(),
            name: profession,
            icon: iconMap[profession.toLowerCase()] || MoreHorizontal,
          }));

          const labourCategories = Array.from(
            new Set(
              labourResponse.data
                ?.map((item) => item.category?.trim())
                .filter((cat): cat is string => !!cat)
            )
          ).map((category) => ({
            id: category.toLowerCase(),
            name: category,
            icon: iconMap[category.toLowerCase()] || MoreHorizontal,
          }));

          fetchedCategories = [
            { id: 'all', name: 'All', icon: MoreHorizontal },
            ...professionalCategories,
            ...labourCategories,
          ];
        } else {
          const tableName = serviceType === 'professional' ? 'professional_profiles' : 'labour_profiles';
          const fieldName = serviceType === 'professional' ? 'profession' : 'category';

          const { data, error } = await supabase
            .from(tableName)
            .select(fieldName)
            .not(fieldName, 'is', null);

          if (error) {
            console.error('Supabase error:', error.message);
            setError('Failed to fetch categories');
            return;
          }

          fetchedCategories = [
            { id: 'all', name: 'All', icon: MoreHorizontal },
            ...Array.from(
              new Set(
                data
                  ?.map((item) => item[fieldName]?.trim())
                  .filter((value): value is string => !!value)
              )
            ).map((value) => ({
              id: value.toLowerCase(),
              name: value,
              icon: iconMap[value.toLowerCase()] || MoreHorizontal,
            })),
          ];
        }

        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [serviceType]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary[600]} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Service Type Selector */}
      <View style={styles.serviceTypeContainer}>
        <TouchableOpacity
          style={[
            styles.serviceTypeButton,
            serviceType === 'professional' && styles.activeServiceType,
          ]}
          onPress={() => onServiceTypeChange('professional')}
        >
          <Users
            size={16}
            color={serviceType === 'professional' ? colors.white : colors.primary[600]}
          />
          <Text
            style={serviceType === 'professional' ? [styles.serviceTypeText, styles.activeServiceTypeText] : styles.serviceTypeText}
          >
            Professional
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.serviceTypeButton,
            serviceType === 'labour' && styles.activeServiceType,
          ]}
          onPress={() => onServiceTypeChange('labour')}
        >
          <HardHat
            size={16}
            color={serviceType === 'labour' ? colors.white : colors.primary[600]}
          />
          <Text
            style={serviceType === 'labour' ? [styles.serviceTypeText, styles.activeServiceTypeText] : styles.serviceTypeText}
          >
            Labour
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.serviceTypeButton,
            serviceType === 'all' && styles.activeServiceType,
          ]}
          onPress={() => onServiceTypeChange('all')}
        >
          <MoreHorizontal
            size={16}
            color={serviceType === 'all' ? colors.white : colors.primary[600]}
          />
          <Text
            style={serviceType === 'all' ? [styles.serviceTypeText, styles.activeServiceTypeText] : styles.serviceTypeText}
          >
            All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Selector */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isActive = activeCategory === item.id;
          const Icon = item.icon;

          return (
            <TouchableOpacity
              style={styles.category}
              onPress={() => onSelectCategory(item.id)}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <Icon size={20} color={isActive ? colors.white : colors.primary[600]} />
              </View>
              <Text style={[styles.categoryName, isActive && styles.activeCategoryName]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.categoryContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  serviceTypeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.md,
  },
  serviceTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 8,
    gap: spacing.xs,
  },
  activeServiceType: {
    backgroundColor: colors.primary[600],
  },
  serviceTypeText: {
    ...typography.labelMedium,
    color: colors.primary[600],
  },
  activeServiceTypeText: {
    color: colors.white,
  },
  categoryContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  category: {
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    width: 70,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    marginBottom: spacing.xs,
  },
  activeIconContainer: {
    backgroundColor: colors.primary[600],
  },
  categoryName: {
    ...typography.labelSmall,
    color: colors.gray[700],
    textAlign: 'center',
  },
  activeCategoryName: {
    color: colors.primary[600],
    fontFamily: 'Inter-Medium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  errorText: {
    ...typography.bodyMedium,
    color: colors.error[600],
  },
});