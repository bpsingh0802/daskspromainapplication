import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { MapPin, DollarSign, Clock, Briefcase, Building, BookOpen, Send } from 'lucide-react-native';
import { Job } from '@/lib/jobsApi';

interface JobCardProps {
  job: Job;
  onPress?: () => void;
  onApply?: (jobId: string) => void;
}

export default function JobCard({ job, onPress, onApply }: JobCardProps) {
  const getJobTypeColor = () => {
    switch (job.jobType) {
      case 'full-time':
        return colors.success[600];
      case 'part-time':
        return colors.warning[600];
      case 'contract':
        return colors.primary[600];
      case 'freelance':
        return colors.secondary[600];
      default:
        return colors.gray[600];
    }
  };

  const getExperienceColor = () => {
    switch (job.experienceLevel) {
      case 'entry':
        return colors.success[600];
      case 'mid':
        return colors.warning[600];
      case 'senior':
        return colors.error[600];
      default:
        return colors.gray[600];
    }
  };

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
    } else if (job.salaryMin) {
      return `$${job.salaryMin.toLocaleString()}+`;
    }
    return 'Salary not specified';
  };

  const getTimeAgo = () => {
    const now = new Date();
    const posted = new Date(job.postedDate);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // Safe text rendering helper
  const safeText = (text: any) => {
    if (text === null || text === undefined || text === '' || text === '.') return '';
    return String(text);
  };

  const safeRender = (content: any) => {
    const textContent = safeText(content);
    if (!textContent || textContent.trim() === '') {
      return <Text style={styles.detailText}></Text>;
    }
    return <Text style={styles.detailText}>{textContent}</Text>;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: job.companyLogo }}
          style={styles.companyLogo}
          resizeMode="contain"
        />
        
        <View style={styles.headerInfo}>
          <Text style={styles.jobTitle} numberOfLines={2}>{safeText(job.title)}</Text>
          <View style={styles.companyInfo}>
            <Building size={14} color={colors.gray[600]} />
            <Text style={styles.companyName}>{safeText(job.company)}</Text>
          </View>
        </View>
        
        <View style={styles.timeContainer}>
          <Text style={styles.timeAgo}>{safeText(getTimeAgo())}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <MapPin size={14} color={colors.gray[600]} />
            {safeRender(job.location)}
          </View>
          
          <View style={styles.detailItem}>
            <Clock size={14} color={colors.gray[600]} />
            {safeRender(job.workMode)}
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <DollarSign size={14} color={colors.gray[600]} />
            {safeRender(formatSalary())}
          </View>
          
          <View style={styles.detailItem}>
            <BookOpen size={14} color={colors.gray[600]} />
            {safeRender(job.education)}
          </View>
        </View>
      </View>
      
      <View style={styles.tags}>
        <View style={[styles.tag, { backgroundColor: `${getJobTypeColor()}20` }]}>
          <Text style={[styles.tagText, { color: getJobTypeColor() }]}>
            {safeText((job.jobType || '').replace('-', ' '))}
          </Text>
        </View>
        
        <View style={[styles.tag, { backgroundColor: `${getExperienceColor()}20` }]}>
          <Text style={[styles.tagText, { color: getExperienceColor() }]}>
            {safeText(job.experienceLevel)} level
          </Text>
        </View>
        
        <View style={[styles.tag, { backgroundColor: colors.primary[50] }]}>
          <Text style={[styles.tagText, { color: colors.primary[600] }]}>
            {safeText(job.category)}
          </Text>
        </View>
      </View>

      {job.description && (
        <Text style={styles.description} numberOfLines={2}>{safeText(job.description)}</Text>
      )}

      <View style={styles.footer}>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => onApply?.(job.id)}
            activeOpacity={0.8}
          >
            <Send size={16} color={colors.white} />
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.skillsContainer}>
          {job.skills && job.skills.slice(0, 3).map((skill, index) => {
            const skillText = safeText(skill);
            if (!skillText || skillText === '.') return null;
            return (
              <View key={index} style={styles.skill}>
                <Text style={styles.skillText}>{skillText}</Text>
              </View>
            );
          })}
          {job.skills && job.skills.length > 3 && (
            <Text style={styles.moreSkills}>+{job.skills.length - 3} more</Text>
          )}
        </View>
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
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  jobTitle: {
    ...typography.headingSmall,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  companyName: {
    ...typography.bodyMedium,
    color: colors.gray[700],
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeAgo: {
    ...typography.bodySmall,
    color: colors.gray[500],
  },
  details: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.gray[700],
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  tagText: {
    ...typography.labelSmall,
    textTransform: 'capitalize',
  },
  description: {
    ...typography.bodyMedium,
    color: colors.gray[700],
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.sm,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  skill: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  skillText: {
    ...typography.labelSmall,
    color: colors.gray[700],
  },
  moreSkills: {
    ...typography.labelSmall,
    color: colors.gray[500],
    fontStyle: 'italic',
  },
  actionContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    gap: spacing.xs,
  },
  applyButtonText: {
    ...typography.labelMedium,
    color: colors.white,
    fontFamily: 'Inter-Medium',
  },
});