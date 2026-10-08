import React, { forwardRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button = forwardRef<TouchableOpacity, ButtonProps>(({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}, ref) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return disabled ? styles.primaryDisabled : styles.primary;
      case 'secondary':
        return disabled ? styles.secondaryDisabled : styles.secondary;
      case 'outline':
        return disabled ? styles.outlineDisabled : styles.outline;
      case 'danger':
        return disabled ? styles.dangerDisabled : styles.danger;
      default:
        return disabled ? styles.primaryDisabled : styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return disabled ? styles.outlineDisabledText : styles.outlineText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      ref={ref}
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary[600] : colors.white} 
          size="small" 
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  text: {
    ...typography.labelLarge,
  },
  primary: {
    backgroundColor: colors.primary[600],
  },
  primaryDisabled: {
    backgroundColor: colors.primary[300],
  },
  primaryText: {
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.secondary[600],
  },
  secondaryDisabled: {
    backgroundColor: colors.secondary[300],
  },
  secondaryText: {
    color: colors.white,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary[600],
  },
  outlineDisabled: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  outlineText: {
    color: colors.primary[600],
  },
  outlineDisabledText: {
    color: colors.gray[400],
  },
  danger: {
    backgroundColor: colors.error[600],
  },
  dangerDisabled: {
    backgroundColor: colors.error[300],
  },
  dangerText: {
    color: colors.white,
  },
});