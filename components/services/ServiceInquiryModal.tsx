import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { X, Send, User, Mail, Phone, MessageSquare } from 'lucide-react-native';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Service } from '@/lib/servicesApi';
import { createServiceInquiry } from '@/lib/inquiriesApi';

interface ServiceInquiryModalProps {
  visible: boolean;
  onClose: () => void;
  service: Service | null;
}

export default function ServiceInquiryModal({ visible, onClose, service }: ServiceInquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setQuery('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email address.');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!query.trim()) {
      Alert.alert('Missing Information', 'Please enter your inquiry message.');
      return;
    }

    if (!service) {
      Alert.alert('Error', 'Service information is not available.');
      return;
    }

    setLoading(true);

    try {
      const inquiryData = {
        service_id: service.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        query: query.trim(),
      };

      const result = await createServiceInquiry(inquiryData);

      if (result.success) {
        Alert.alert(
          'Inquiry Submitted!',
          'Thank you for your inquiry. The service provider will contact you soon.',
          [
            {
              text: 'OK',
              onPress: handleClose,
            },
          ]
        );
      } else {
        Alert.alert('Submission Failed', result.error || 'Failed to submit your inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

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
            <Text style={styles.headerTitle}>Service Inquiry</Text>
            <Text style={styles.headerSubtitle}>Get in touch with the service provider</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Service Info */}
          <View style={styles.serviceCard}>
            <Text style={styles.serviceName}>{service.title}</Text>
            <Text style={styles.serviceProvider}>by {service.providerName}</Text>
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceCategory}>{service.category}</Text>
              <Text style={styles.servicePrice}>${service.price}/{service.priceUnit}</Text>
            </View>
          </View>

          {/* Inquiry Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Your Information</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <User size={18} color={colors.primary[600]} />
              </View>
              <Input
                label="Full Name *"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                autoCapitalize="words"
                style={styles.inputWithIcon}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Mail size={18} color={colors.primary[600]} />
              </View>
              <Input
                label="Email Address *"
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.inputWithIcon}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Phone size={18} color={colors.primary[600]} />
              </View>
              <Input
                label="Phone Number (Optional)"
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 (555) 123-4567"
                keyboardType="phone-pad"
                style={styles.inputWithIcon}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <MessageSquare size={18} color={colors.primary[600]} />
              </View>
              <Input
                label="Your Inquiry *"
                value={query}
                onChangeText={setQuery}
                placeholder="Please describe what you need help with..."
                multiline
                numberOfLines={4}
                style={styles.inputWithIcon}
              />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Your inquiry will be sent directly to the service provider. They will contact you using the information provided above.
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
            title={loading ? "Submitting..." : "Send Inquiry"}
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
  serviceCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  serviceName: {
    ...typography.headingMedium,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  serviceProvider: {
    ...typography.bodyMedium,
    color: colors.primary[600],
    marginBottom: spacing.sm,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceCategory: {
    ...typography.labelMedium,
    color: colors.gray[700],
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  servicePrice: {
    ...typography.labelLarge,
    color: colors.primary[700],
    fontFamily: 'Inter-Bold',
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