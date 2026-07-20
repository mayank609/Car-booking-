import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { colors, fontFamily, fontSize, radius, spacing } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export default function ScreenHeader({ title, subtitle, onBack, rightIcon, onRightPress }: Props) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <AnimatedPressable onPress={onBack} style={styles.iconButton} scaleTo={0.88}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </AnimatedPressable>
      ) : (
        <View style={styles.iconButton} />
      )}

      <View style={styles.titleWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightIcon ? (
        <AnimatedPressable onPress={onRightPress} style={styles.iconButton} scaleTo={0.88}>
          <Ionicons name={rightIcon} size={20} color={colors.textPrimary} />
        </AnimatedPressable>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
