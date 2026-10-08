import { TextStyle } from 'react-native';

type FontWeight = 'regular' | 'medium' | 'bold';

type TypographyStyles = {
  [key in
    | 'displayLarge'
    | 'displayMedium'
    | 'displaySmall'
    | 'headingLarge'
    | 'headingMedium'
    | 'headingSmall'
    | 'bodyLarge'
    | 'bodyMedium'
    | 'bodySmall'
    | 'labelLarge'
    | 'labelMedium'
    | 'labelSmall']: TextStyle;
};

const fontFamily: Record<FontWeight, string> = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
};

export const typography: TypographyStyles = {
  displayLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: 0,
  },
  displayMedium: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0,
  },
  headingLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
  },
  headingMedium: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0,
  },
  headingSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  bodyMedium: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.15,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
};