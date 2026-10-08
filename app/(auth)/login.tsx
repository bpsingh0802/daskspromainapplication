import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { ChevronLeft, Phone } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import OTPLogin from '@/components/auth/OTPLogin';

export default function LoginScreen() {
  const router = useRouter();
  const [showOTPLogin, setShowOTPLogin] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOTPLoginSuccess = () => {
    router.replace('/(tabs)/');
  };

  if (showOTPLogin) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <OTPLogin onLoginSuccess={handleOTPLoginSuccess} />
      </SafeAreaView>
    );
  }

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Check if identifier is email or phone
      const isEmail = identifier.includes('@');
      
      let { error } = await supabase.auth.signInWithPassword({
        email: isEmail ? identifier : undefined,
        phone: !isEmail ? identifier : undefined,
        password,
      });

      if (error) throw error;
      
      router.replace('/(tabs)/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
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
            <Text style={styles.title}>Sign In</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Welcome back!</Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              title="Login with Phone Number"
              variant="primary"
              onPress={() => setShowOTPLogin(true)}
              style={styles.phoneButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.inputContainer}>
              <Input
                label="Email or Phone"
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="your.email@example.com or +1234567890"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Sign In with Password"
              variant="outline"
              onPress={handleLogin}
              loading={loading}
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Create one</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    ...typography.bodyMedium,
    color: colors.primary[600],
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.gray[500],
    marginHorizontal: spacing.md,
  },
  phoneButton: {
    marginBottom: spacing.md,
  },
});