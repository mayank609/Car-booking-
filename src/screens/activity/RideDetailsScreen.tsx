import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRide } from '../../context/RideContext';
import { formatCurrency } from '../../utils/format';
import Button from '../../components/Button';
import Card from '../../components/Card';
import RatingStars from '../../components/RatingStars';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, fontFamily, fontSize, radius, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'RideDetails'>;

export default function RideDetailsScreen({ navigation, route }: Props) {
  const { history } = useRide();
  const item = history.find((h) => h.id === route.params.historyId);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Ride details" onBack={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const isCancelled = item.status === 'cancelled';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Ride details" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.routeIcons}>
              <View style={styles.dotAccent} />
              <View style={styles.routeLine} />
              <Ionicons name="location" size={16} color={colors.danger} />
            </View>
            <View style={styles.routeText}>
              <Text style={styles.placeTitle} numberOfLines={1}>
                {item.pickupTitle}
              </Text>
              <View style={{ height: spacing.lg }} />
              <Text style={styles.placeTitle} numberOfLines={1}>
                {item.dropTitle}
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, isCancelled ? styles.statusBadgeCancelled : styles.statusBadgeDone]}>
            <Ionicons
              name={isCancelled ? 'close-circle' : 'checkmark-circle'}
              size={14}
              color={isCancelled ? colors.danger : colors.success}
            />
            <Text style={[styles.statusText, { color: isCancelled ? colors.danger : colors.success }]}>
              {isCancelled ? 'Cancelled' : 'Completed'}
            </Text>
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        {!isCancelled && (
          <Card style={styles.driverCard}>
            <Text style={styles.sectionLabel}>Driver</Text>
            <View style={styles.driverRow}>
              <Text style={styles.driverName}>{item.driverName}</Text>
              {item.rating && <RatingStars rating={item.rating} size={14} />}
            </View>
          </Card>
        )}

        <Card style={styles.fareCard}>
          <Text style={styles.sectionLabel}>Trip summary</Text>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Ride type</Text>
            <Text style={styles.fareValue}>{item.rideOptionName}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Distance</Text>
            <Text style={styles.fareValue}>{item.distanceKm.toFixed(1)} km</Text>
          </View>
          <View style={[styles.fareRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total fare</Text>
            <Text style={styles.totalValue}>{isCancelled ? '—' : formatCurrency(item.fare)}</Text>
          </View>
        </Card>

        <Button
          label="Need help with this ride?"
          variant="ghost"
          onPress={() => navigation.navigate('Help')}
          icon="help-circle-outline"
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Book Again"
          onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }))}
          icon="refresh"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  routeCard: { marginBottom: spacing.md },
  routeRow: {
    flexDirection: 'row',
  },
  routeIcons: {
    alignItems: 'center',
    marginRight: spacing.sm,
    paddingTop: 3,
  },
  dotAccent: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  routeText: { flex: 1 },
  placeTitle: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusBadgeDone: { backgroundColor: colors.successSoft },
  statusBadgeCancelled: { backgroundColor: colors.dangerSoft },
  statusText: {
    marginLeft: 4,
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.xs,
  },
  dateText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  driverCard: { marginBottom: spacing.md },
  sectionLabel: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverName: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  fareCard: { marginBottom: spacing.lg },
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
