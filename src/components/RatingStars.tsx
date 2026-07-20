import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { colors, spacing } from '../theme';

interface Props {
  rating: number;
  size?: number;
  editable?: boolean;
  onChange?: (value: number) => void;
  color?: string;
}

export default function RatingStars({ rating, size = 20, editable = false, onChange, color = colors.amber }: Props) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row}>
      {stars.map((star) => {
        const filled = star <= Math.round(rating);
        const icon = filled ? 'star' : 'star-outline';

        if (!editable) {
          return <Ionicons key={star} name={icon} size={size} color={color} style={styles.gap} />;
        }

        return (
          <AnimatedPressable key={star} onPress={() => onChange?.(star)} style={styles.gap} scaleTo={0.8}>
            <Ionicons name={icon} size={size} color={color} />
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gap: {
    marginRight: spacing.xxs,
  },
});
