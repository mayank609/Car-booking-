import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  elevated?: boolean;
}

export default function Card({ children, style, padded = true, elevated = true }: Props) {
  return (
    <View style={[styles.card, padded && styles.padded, elevated && shadow.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  padded: {
    padding: spacing.md,
  },
});
