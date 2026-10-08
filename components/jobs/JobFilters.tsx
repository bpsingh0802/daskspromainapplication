import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { X, MapPin, Briefcase, GraduationCap, DollarSign, Clock, Monitor } from 'lucide-react-native';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { JobFilters as JobFiltersType } from '@/lib/jobsApi';
import { supabase } from '@/lib/supabase';

interface JobFiltersProps {
  filters: JobFiltersType;
  onApplyFilters: (filters: JobFiltersType) => void;
  onClose: () => void;
}

const jobTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

const experienceLevelOptions = [
  { value: 'all', label: 'All Levels' },
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'executive', label: 'Executive' },
];

const educationOptions = [
  { value: 'all', label: 'All Education' },
  { value: 'high-school', label: 'High School' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'phd', label: 'PhD' },
  { value: 'certification', label: 'Professional Certification' },
];

const salaryRangeOptions = [
  { value: 'all', label: 'All Salaries' },
  { value: '0-30000', label: 'Under $30k' },
  { value: '30000-50000', label: '$30k - $50k' },
  { value: '50000-75000', label: '$50k - $75k' },
  { value: '75000-100000', label: '$75k - $100k' },
  { value: '100000-150000', label: '$100k - $150k' },
  { value: '150000+', label: '$150k+' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'construction', label: 'Construction' },
  { value: 'hospitality', label: 'Hospitality' },
];

const workModeOptions = [
  { value: 'all', label: 'All Modes' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on-site', label: 'On-site' },
];

const postedWithinOptions = [
  { value: 'all', label: 'All Time' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '3d', label: 'Last 3 days' },
  { value: '7d', label: 'Last week' },
  { value: '30d', label: 'Last month' },
];

export default function JobFilters({ filters, onApplyFilters, onClose }: JobFiltersProps) {
  const [localFilters, setLocalFilters] = useState<JobFiltersType>(filters);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    fetchLocationSuggestions();
  }, []);

  const fetchLocationSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('location')
        .not('location', 'is', null)
        .eq('status', 'approved');

      if (!error && data) {
        const uniqueLocations = Array.from(
          new Set(data.map(item => item.location?.trim()).filter(Boolean))
        );
        setLocationSuggestions(uniqueLocations);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const updateFilter = (key: keyof JobFiltersType, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLocationChange = (value: string) => {
    updateFilter('location', value);
    setShowLocationSuggestions(value.length > 0);
  };

  const handleLocationSuggestionSelect = (suggestion: string) => {
    updateFilter('location', suggestion);
    setShowLocationSuggestions(false);
  };

  const resetFilters = () => {
    setLocalFilters({
      location: '',
      jobType: 'all',
      experienceLevel: 'all',
      education: 'all',
      salaryRange: 'all',
      category: 'all',
      workMode: 'all',
      postedWithin: 'all',
    });
    setShowLocationSuggestions(false);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const renderFilterSection = (
    title: string,
    icon: React.ReactNode,
    options: { value: string; label: string }[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              selectedValue === option.value && styles.selectedOption
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.optionText,
              selectedValue === option.value && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter Jobs</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Filter */}
        <View style={styles.filterSection}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={colors.primary[600]} />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <View style={styles.locationContainer}>
            <Input
              value={localFilters.location}
              onChangeText={handleLocationChange}
              placeholder="Enter city, state, or country"
              style={styles.locationInput}
            />
            
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <ScrollView 
                  style={styles.suggestionsList}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
                >
                  {locationSuggestions
                    .filter(location => 
                      location.toLowerCase().includes(localFilters.location.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => handleLocationSuggestionSelect(suggestion)}
                      >
                        <MapPin size={16} color={colors.gray[500]} />
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            )}
            
            {loadingSuggestions && (
              <Text style={styles.loadingText}>Loading locations...</Text>
            )}
          </View>
        </View>

        {/* Job Type */}
        {renderFilterSection(
          'Job Type',
          <Briefcase size={20} color={colors.primary[600]} />,
          jobTypeOptions,
          localFilters.jobType,
          (value) => updateFilter('jobType', value)
        )}

        {/* Experience Level */}
        {renderFilterSection(
          'Experience Level',
          <Clock size={20} color={colors.primary[600]} />,
          experienceLevelOptions,
          localFilters.experienceLevel,
          (value) => updateFilter('experienceLevel', value)
        )}

        {/* Education */}
        {renderFilterSection(
          'Education Required',
          <GraduationCap size={20} color={colors.primary[600]} />,
          educationOptions,
          localFilters.education,
          (value) => updateFilter('education', value)
        )}

        {/* Salary Range */}
        {renderFilterSection(
          'Salary Range',
          <DollarSign size={20} color={colors.primary[600]} />,
          salaryRangeOptions,
          localFilters.salaryRange,
          (value) => updateFilter('salaryRange', value)
        )}

        {/* Category */}
        {renderFilterSection(
          'Category',
          <Briefcase size={20} color={colors.primary[600]} />,
          categoryOptions,
          localFilters.category,
          (value) => updateFilter('category', value)
        )}

        {/* Work Mode */}
        {renderFilterSection(
          'Work Mode',
          <Monitor size={20} color={colors.primary[600]} />,
          workModeOptions,
          localFilters.workMode,
          (value) => updateFilter('workMode', value)
        )}

        {/* Posted Within */}
        {renderFilterSection(
          'Posted Within',
          <Clock size={20} color={colors.primary[600]} />,
          postedWithinOptions,
          localFilters.postedWithin,
          (value) => updateFilter('postedWithin', value)
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Reset"
          variant="outline"
          onPress={resetFilters}
          style={styles.resetButton}
        />
        <Button
          title="Apply Filters"
          variant="primary"
          onPress={handleApply}
          style={styles.applyButton}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    ...typography.headingLarge,
    color: colors.gray[900],
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  filterSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.gray[900],
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
  },
  selectedOption: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  optionText: {
    ...typography.bodyMedium,
    color: colors.gray[700],
  },
  selectedOptionText: {
    color: colors.white,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    gap: spacing.md,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
  locationContainer: {
    position: 'relative',
  },
  locationInput: {
    marginBottom: 0,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    gap: spacing.sm,
  },
  suggestionText: {
    ...typography.bodyMedium,
    color: colors.gray[700],
    flex: 1,
  },
  loadingText: {
    ...typography.bodySmall,
    color: colors.gray[500],
    textAlign: 'center',
    padding: spacing.sm,
  },
});