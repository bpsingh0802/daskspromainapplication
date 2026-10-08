import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { ChevronLeft } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const USER_TYPE_OPTIONS = [
  { label: 'Customer', value: 'customer' },
  { label: 'Professional', value: 'professional' },
  { label: 'Labour', value: 'labour' },
  { label: 'Service Provider', value: 'service_provider' },
  { label: 'Recruiter', value: 'recruiter' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+[1-9]\d{1,14}$/.test(phone);
  };

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password || !confirmPassword || !userType) {
      setError('All fields are required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            user_type: userType,
          },
        },
      });

      if (error) throw error;

      // Redirect to login page after successful registration
      router.replace('/login');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.gray[700]} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Join our community</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Input
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Doe"
                autoCapitalize="words"
              />

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="+1234567890"
                keyboardType="phone-pad"
              />

              <Dropdown
                label="I am registering as a:"
                value={userType}
                onValueChange={setUserType}
                options={USER_TYPE_OPTIONS}
                placeholder="Select user type"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
              />
            </View>
            
            <Button 
              title="Create Account" 
              variant="primary" 
              onPress={handleRegister} 
              loading={loading}
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.headingLarge,
    color: colors.gray[900],
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    maxWidth: Platform.OS === 'web' ? 400 : undefined,
    alignSelf: 'center',
    width: '100%',
  },
  subtitle: {
    ...typography.headingMedium,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  errorContainer: {
    backgroundColor: colors.error[50],
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.error[300],
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodyMedium,
    color: colors.error[700],
  },
  inputContainer: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  footerText: {
    ...typography.bodyMedium,
    color: colors.gray[600],
  },
  footerLink: {
    ...typography.bodyMedium,
    color: colors.primary[600],
    fontFamily: 'Inter-Medium',
  },
});