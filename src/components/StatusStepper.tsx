import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, fontSize, spacing } from '../theme';
import { RideStatus } from '../data/types';

const STEPS: { status: RideStatus; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { status: 'assigned', label: 'Assigned', icon: 'person' },
  { status: 'arriving', label: 'Arriving', icon: 'navigate' },
  { status: 'arrived', label: 'Arrived', icon: 'location' },
  { status: 'in_progress', label: 'On trip', icon: 'car-sport' },
  { status: 'completed', label: 'Done', icon: 'checkmark-done' },
];

export default function StatusStepper({ current }: { current: RideStatus }) {
  const currentIndex = STEPS.findIndex((s) => s.status === current);

  return (
    <View style={styles.row}>
      {STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        const stateColor = done || active ? colors.accent : colors.border;

        return (
          <React.Fragment key={step.status}>
            <View style={styles.stepWrap}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: done ? colors.accent : active ? colors.accentSoft : colors.surfaceAlt },
                  active && styles.dotActive,
                ]}
              >
                <Ionicons
                  name={done ? 'checkmark' : step.icon}
                  size={14}
                  color={done ? colors.white : active ? colors.accent : colors.textTertiary}
                />
              </View>
              <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
                {step.label}
              </Text>
            </View>
            {index < STEPS.length - 1 && (
              <View style={[styles.line, { backgroundColor: index < currentIndex ? colors.accent : colors.border }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
  },
  stepWrap: {
    alignItems: 'center',
    width: 52,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  line: {
    height: 2,
    flex: 1,
    marginTop: 15,
    marginHorizontal: -6,
  },
  label: {
    marginTop: spacing.xxs,
    fontFamily: fontFamily.body,
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: fontFamily.bodySemiBold,
    color: colors.textPrimary,
  },
});
