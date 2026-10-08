import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { X, FileText, Upload, Briefcase } from 'lucide-react-native';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Job } from '@/lib/jobsApi';
import { createJobApplication } from '@/lib/jobApplicationApi';

interface JobApplicationModalProps {
  visible: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function JobApplicationModal({ visible, onClose, job }: JobApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<{ name: string; size: number } | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCoverLetter('');
    setResumeFile(null);
    setResumeBase64(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleResumeUpload = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.txt';

      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            Alert.alert('File too large', 'Resume must be less than 5MB');
            return;
          }

          const reader = new FileReader();
          reader.onload = (event: any) => {
            setResumeFile({
              name: file.name,
              size: file.size,
            });
            setResumeBase64(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      };

      input.click();
    } else {
      Alert.alert('Upload Resume', 'Please share your resume URL for now');
    }
  };

  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      Alert.alert('Missing Information', 'Please enter a cover letter.');
      return;
    }

    if (!job) {
      Alert.alert('Error', 'Job information is not available.');
      return;
    }

    setLoading(true);

    try {
      const applicationData = {
        job_id: job.id,
        cover_letter: coverLetter.trim(),
        resume_url: resumeBase64 || null,
      };

      const result = await createJobApplication(applicationData);

      if (result.success) {
        Alert.alert(
          'Application Submitted!',
          'Your job application has been submitted successfully. The employer will review your application and contact you if selected.',
          [
            {
              text: 'OK',
              onPress: handleClose,
            },
          ]
        );
      } else {
        Alert.alert('Submission Failed', result.error || 'Failed to submit your application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Apply for Job</Text>
            <Text style={styles.headerSubtitle}>Submit your application</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Job Info */}
          <View style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Briefcase size={20} color={colors.primary[600]} />
              <Text style={styles.jobTitle}>{job.title}</Text>
            </View>
            <Text style={styles.jobCompany}>{job.company}</Text>
            <View style={styles.jobDetails}>
              <Text style={styles.jobLocation}>{job.location}</Text>
              <Text style={styles.jobType}>{job.job_type}</Text>
            </View>
          </View>

          {/* Application Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Your Application</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <FileText size={18} color={colors.primary[600]} />
              </View>
              <Input
                label="Cover Letter *"
                value={coverLetter}
                onChangeText={setCoverLetter}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                multiline
                numberOfLines={6}
                style={styles.inputWithIcon}
              />
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity
                style={[styles.uploadButton, resumeFile && styles.uploadButtonActive]}
                onPress={handleResumeUpload}
              >
                <Upload size={20} color={resumeFile ? colors.white : colors.primary[600]} />
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={[styles.uploadLabel, resumeFile && styles.uploadLabelActive]}>
                    {resumeFile ? 'Resume Selected' : 'Upload Resume'}
                  </Text>
                  <Text style={[styles.uploadHint, resumeFile && styles.uploadHintActive]}>
                    {resumeFile ? resumeFile.name : 'PDF, DOC, DOCX, TXT (Max 5MB)'}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.optionalLabel}>(Optional)</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Your application will be sent directly to the employer. Make sure your cover letter highlights your relevant experience and enthusiasm for the role.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleClose}
            style={styles.cancelButton}
          />
          <Button
            title={loading ? "Submitting..." : "Submit Application"}
            variant="primary"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
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
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.headingLarge,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    color: colors.gray[600],
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  jobCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  jobTitle: {
    ...typography.headingMedium,
    color: colors.gray[900],
    flex: 1,
  },
  jobCompany: {
    ...typography.bodyMedium,
    color: colors.primary[600],
    marginBottom: spacing.sm,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobLocation: {
    ...typography.labelMedium,
    color: colors.gray[700],
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  jobType: {
    ...typography.labelMedium,
    color: colors.primary[700],
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    textTransform: 'capitalize',
  },
  form: {
    gap: spacing.lg,
  },
  formTitle: {
    ...typography.headingSmall,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  inputGroup: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: spacing.md,
    top: 32, // Adjust based on label height
    zIndex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xs,
  },
  inputWithIcon: {
    paddingLeft: 50, // Make room for icon
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary[300],
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.primary[50],
    borderStyle: 'dashed',
  },
  uploadButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
    borderStyle: 'solid',
  },
  uploadLabel: {
    ...typography.labelMedium,
    color: colors.primary[600],
  },
  uploadLabelActive: {
    color: colors.white,
  },
  uploadHint: {
    ...typography.labelSmall,
    color: colors.primary[500],
    marginTop: spacing.xs,
  },
  uploadHintActive: {
    color: colors.gray[100],
  },
  optionalLabel: {
    ...typography.labelSmall,
    color: colors.gray[600],
    marginTop: spacing.sm,
  },
  infoBox: {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[600],
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.gray[700],
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});