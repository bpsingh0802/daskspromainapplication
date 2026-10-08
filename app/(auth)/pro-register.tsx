import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { ChevronLeft } from 'lucide-react-native';

export default function ProRegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = () => {
    if (!name || !businessName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Simulate registration
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/pro-dashboard');
    }, 1000);
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
            <Text style={styles.title}>Join as a Professional</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Create your professional account</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                autoCapitalize="words"
              />
              
              <Input
                label="Business Name"
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="Your Business Name"
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
              title="Create Professional Account" 
              variant="primary" 
              onPress={handleRegister} 
              loading={loading}
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have a professional account?</Text>
              <Link href="/pro-login" asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
            
            <View style={styles.clientSignIn}>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.clientSignInText}>Sign up as a client instead</Text>
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
    flexWrap: 'wrap',
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
  clientSignIn: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  clientSignInText: {
    ...typography.bodyMedium,
    color: colors.gray[500],
    textDecorationLine: 'underline',
  },
});