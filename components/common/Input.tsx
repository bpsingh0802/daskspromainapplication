import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedContainer,
          error && styles.errorContainer,
          multiline && styles.multilineContainer,
        ]}
      >
        <TextInput
          style={[
            styles.input, 
            inputStyle,
            multiline && styles.multilineInput
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={colors.gray[600]} />
            ) : (
              <Eye size={20} color={colors.gray[600]} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.labelMedium,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: colors.white,
    minHeight: 48,
  },
  focusedContainer: {
    borderColor: colors.primary[500],
  },
  errorContainer: {
    borderColor: colors.error[500],
  },
  multilineContainer: {
    minHeight: 100,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.gray[900],
    ...typography.bodyMedium,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  toggleButton: {
    padding: spacing.sm,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error[600],
    marginTop: spacing.xs,
  },
});