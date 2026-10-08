import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/constants/typography';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import Button from '@/components/common/Button';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>ServicePro</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Find Professional Services</Text>
          <Text style={styles.subtitle}>
            Connect with trusted professionals for all your service needs
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Link href="/login" asChild>
            <Button title="Sign In" variant="primary" />
          </Link>
          
          <Link href="/register" asChild>
            <Button title="Create an Account" variant="outline" style={styles.secondaryButton} />
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logo: {
    ...typography.displayMedium,
    color: colors.primary[600],
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  image: {
    width: Platform.OS === 'web' ? 400 : '100%',
    height: 300,
    borderRadius: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.displaySmall,
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.gray[600],
    textAlign: 'center',
  },
  buttonContainer: {
    gap: spacing.md,
    marginBottom: Platform.OS === 'web' ? spacing.xl : spacing.lg,
  },
  secondaryButton: {
    marginBottom: spacing.sm,
  },
});