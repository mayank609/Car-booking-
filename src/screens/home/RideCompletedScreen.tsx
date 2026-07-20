import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRide } from '../../context/RideContext';
import { formatCurrency } from '../../utils/format';
import AnimatedPressable from '../../components/AnimatedPressable';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import RatingStars from '../../components/RatingStars';
import { colors, fontFamily, fontSize, radius, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'RideCompleted'>;

const feedbackTags = ['Great driving', 'Clean vehicle', 'On time', 'Friendly', 'Safe ride'];
const tipOptions = [0, 20, 40, 60];

export default function RideCompletedScreen({ navigation }: Props) {
  const { activeRide, finishRideFeedback } = useRide();
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (!activeRide) {
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }));
    }
  }, [activeRide, navigation]);

  if (!activeRide) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = () => {
    finishRideFeedback(rating, tip);
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={56} color={colors.accent} />
        </View>
        <Text style={styles.title}>Trip completed!</Text>
        <Text style={styles.subtitle}>You've arrived at {activeRide.drop.title}</Text>

        <Card style={styles.driverCard}>
          <Avatar uri={activeRide.driver?.photoUrl} size={56} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{activeRide.driver?.name}</Text>
            <Text style={styles.driverVehicle}>
              {activeRide.driver?.vehicleColor} {activeRide.driver?.vehicleModel}
            </Text>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>How was your ride?</Text>
        <View style={styles.starsWrap}>
          <RatingStars rating={rating} editable size={36} onChange={setRating} />
        </View>

        <View style={styles.tagsRow}>
          {feedbackTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <AnimatedPressable
                key={tag}
                style={[styles.tag, active && styles.tagActive]}
                onPress={() => toggleTag(tag)}
                scaleTo={0.95}
              >
                <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
              </AnimatedPressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Add a tip for {activeRide.driver?.name.split(' ')[0]}</Text>
        <View style={styles.tipsRow}>
          {tipOptions.map((amount) => {
            const active = tip === amount;
            return (
              <AnimatedPressable
                key={amount}
                style={[styles.tipChip, active && styles.tipChipActive]}
                onPress={() => setTip(amount)}
                scaleTo={0.93}
              >
                <Text style={[styles.tipText, active && styles.tipTextActive]}>
                  {amount === 0 ? 'No tip' : formatCurrency(amount)}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>

        <Card style={styles.fareCard}>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Trip fare</Text>
            <Text style={styles.fareValue}>{formatCurrency(activeRide.fare)}</Text>
          </View>
          {tip > 0 && (
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Tip</Text>
              <Text style={styles.fareValue}>{formatCurrency(tip)}</Text>
            </View>
          )}
          <View style={[styles.fareRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total paid</Text>
            <Text style={styles.totalValue}>{formatCurrency(activeRide.fare + tip)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <MaterialCommunityIcons name={activeRide.paymentMethod.icon as never} size={16} color={colors.textSecondary} />
            <Text style={styles.paymentText}>Paid via {activeRide.paymentMethod.label}</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Submit & Done" onPress={handleSubmit} icon="checkmark-done" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  successIcon: { marginBottom: spacing.sm },
  title: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.lg,
  },
  driverInfo: { marginLeft: spacing.sm },
  driverName: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  driverVehicle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionLabel: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  starsWrap: {
    marginBottom: spacing.lg,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: spacing.lg,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagActive: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  tagText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  tagTextActive: {
    color: colors.accentDark,
  },
  tipsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: spacing.lg,
  },
  tipChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    marginRight: spacing.xs,
  },
  tipChipActive: {
    backgroundColor: colors.primary,
  },
  tipText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  tipTextActive: {
    color: colors.white,
  },
  fareCard: {
    width: '100%',
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  fareLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  fareValue: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  totalRow: {
    paddingTop: spacing.xs,
    marginTop: spacing.xxs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  totalValue: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  paymentText: {
    marginLeft: spacing.xs,
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
