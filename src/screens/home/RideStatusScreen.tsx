import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { RootStackParamList } from '../../navigation/types';
import { useRide } from '../../context/RideContext';
import { GeoPoint } from '../../data/types';
import { formatCurrency, interpolate } from '../../utils/format';
import AnimatedPressable from '../../components/AnimatedPressable';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import RatingStars from '../../components/RatingStars';
import StatusStepper from '../../components/StatusStepper';
import { colors, fontFamily, fontSize, radius, shadow, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'RideStatus'>;

const STATUS_COPY: Record<string, { title: string; subtitle: string }> = {
  assigned: { title: 'Driver assigned!', subtitle: 'Your driver is getting ready to head your way.' },
  arriving: { title: 'Driver is on the way', subtitle: 'Track your driver arriving at your pickup point.' },
  arrived: { title: 'Your driver has arrived', subtitle: 'Share your OTP with the driver to start the trip.' },
  in_progress: { title: 'Trip in progress', subtitle: 'Sit back and enjoy the ride.' },
};

export default function RideStatusScreen({ navigation }: Props) {
  const { activeRide, cancelRide } = useRide();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeRide) {
      navigation.replace('MainTabs');
    } else if (activeRide.status === 'completed') {
      navigation.replace('RideCompleted');
    }
  }, [activeRide, navigation]);

  const pulse = useSharedValue(0.7);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.6, { duration: 1400 }), -1, false);
  }, [pulse]);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 1 - (pulse.value - 0.7) / 0.9,
  }));

  const driverPosition: GeoPoint | null = useMemo(() => {
    if (!activeRide?.driver) return null;
    const elapsed = Date.now() - activeRide.stageStartedAt;
    const t = Math.min(1, Math.max(0, elapsed / activeRide.stageDurationMs));

    if (activeRide.status === 'arriving' && activeRide.driverStartPoint) {
      return interpolate(activeRide.driverStartPoint, activeRide.pickup, t);
    }
    if (activeRide.status === 'in_progress') {
      return interpolate(activeRide.pickup, activeRide.drop, t);
    }
    if (activeRide.status === 'arrived') return activeRide.pickup;
    return activeRide.driverStartPoint ?? activeRide.pickup;
    // `tick` forces a recompute every second so the marker animates smoothly
  }, [activeRide, tick]);

  if (!activeRide) return null;

  const handleCancel = () => {
    Alert.alert('Cancel ride request?', 'Your request will be withdrawn.', [
      { text: 'Keep waiting', style: 'cancel' },
      { text: 'Yes, cancel', style: 'destructive', onPress: cancelRide },
    ]);
  };

  const region = useMemo(() => {
    const midLat = (activeRide.pickup.latitude + activeRide.drop.latitude) / 2;
    const midLng = (activeRide.pickup.longitude + activeRide.drop.longitude) / 2;
    const latDelta = Math.max(0.03, Math.abs(activeRide.pickup.latitude - activeRide.drop.latitude) * 2);
    const lngDelta = Math.max(0.03, Math.abs(activeRide.pickup.longitude - activeRide.drop.longitude) * 2);
    return { latitude: midLat, longitude: midLng, latitudeDelta: latDelta, longitudeDelta: lngDelta };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRide.id]);

  const canCancel = activeRide.status === 'requesting' || activeRide.status === 'assigned' || activeRide.status === 'arriving';

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} region={region} showsCompass={false}>
        <Marker coordinate={activeRide.pickup} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <View style={styles.pickupDot} />
        </Marker>
        <Marker coordinate={activeRide.drop} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
          <Ionicons name="location" size={30} color={colors.danger} />
        </Marker>
        {driverPosition && (
          <Marker coordinate={driverPosition} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges>
            <View style={styles.driverMarker}>
              <MaterialCommunityIcons name={activeRide.rideOption.icon as never} size={16} color={colors.white} />
            </View>
          </Marker>
        )}
        <Polyline coordinates={[activeRide.pickup, activeRide.drop]} strokeColor={colors.borderStrong} strokeWidth={3} lineDashPattern={[8, 6]} />
      </MapView>

      <SafeAreaView style={styles.topBar} edges={['top']}>
        <AnimatedPressable style={styles.iconButton} onPress={() => navigation.navigate('MainTabs')} scaleTo={0.9}>
          <Ionicons name="chevron-down" size={22} color={colors.textPrimary} />
        </AnimatedPressable>
      </SafeAreaView>

      <View style={styles.sheet}>
        <Card style={styles.card} elevated={false}>
          {activeRide.status === 'requesting' ? (
            <View style={styles.requestingWrap}>
              <View style={styles.radarWrap}>
                <Animated.View style={[styles.radarRing, pulseStyle]} />
                <View style={styles.radarCore}>
                  <Ionicons name="headset" size={26} color={colors.white} />
                </View>
              </View>
              <Text style={styles.requestingTitle}>Sending your request to our team</Text>
              <Text style={styles.requestingSubtitle}>
                Hang tight — an admin is reviewing your ride and will assign a nearby driver shortly.
              </Text>
              <View style={styles.summaryRow}>
                <MaterialCommunityIcons name={activeRide.rideOption.icon as never} size={20} color={colors.textSecondary} />
                <Text style={styles.summaryText}>
                  {activeRide.rideOption.name} · {formatCurrency(activeRide.fare)}
                </Text>
              </View>
              <Button label="Cancel Request" variant="outline" onPress={handleCancel} style={styles.cancelSpacing} />
            </View>
          ) : (
            <>
              <StatusStepper current={activeRide.status} />

              <View style={styles.statusHeader}>
                <Text style={styles.statusTitle}>{STATUS_COPY[activeRide.status]?.title}</Text>
                <Text style={styles.statusSubtitle}>{STATUS_COPY[activeRide.status]?.subtitle}</Text>
              </View>

              {activeRide.driver && (
                <View style={styles.driverRow}>
                  <Avatar uri={activeRide.driver.photoUrl} size={52} />
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>{activeRide.driver.name}</Text>
                    <View style={styles.ratingRow}>
                      <RatingStars rating={activeRide.driver.rating} size={12} />
                      <Text style={styles.ratingValue}>{activeRide.driver.rating.toFixed(1)}</Text>
                    </View>
                    <Text style={styles.vehicleText}>
                      {activeRide.driver.vehicleColor} {activeRide.driver.vehicleModel} · {activeRide.driver.vehiclePlate}
                    </Text>
                  </View>
                  <View style={styles.contactButtons}>
                    <AnimatedPressable
                      style={styles.contactButton}
                      onPress={() => Linking.openURL(`tel:${activeRide.driver?.phone}`)}
                      scaleTo={0.9}
                    >
                      <Ionicons name="call" size={16} color={colors.white} />
                    </AnimatedPressable>
                    <AnimatedPressable
                      style={[styles.contactButton, styles.contactButtonAlt]}
                      onPress={() => Linking.openURL(`sms:${activeRide.driver?.phone}`)}
                      scaleTo={0.9}
                    >
                      <Ionicons name="chatbubble-ellipses" size={16} color={colors.primary} />
                    </AnimatedPressable>
                  </View>
                </View>
              )}

              {activeRide.status !== 'in_progress' && (
                <View style={styles.otpRow}>
                  <Text style={styles.otpLabel}>Share OTP with driver</Text>
                  <View style={styles.otpChip}>
                    {activeRide.otp.split('').map((digit, i) => (
                      <Text key={i} style={styles.otpDigit}>
                        {digit}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.tripInfoRow}>
                <View style={styles.tripInfoItem}>
                  <Ionicons name="navigate-circle-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.tripInfoText} numberOfLines={1}>
                    {activeRide.pickup.title}
                  </Text>
                </View>
                <View style={styles.tripInfoItem}>
                  <Ionicons name="flag-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.tripInfoText} numberOfLines={1}>
                    {activeRide.drop.title}
                  </Text>
                </View>
              </View>

              {canCancel && <Button label="Cancel Ride" variant="outline" onPress={handleCancel} />}
            </>
          )}
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },
  pickupDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.white,
  },
  driverMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  card: { ...shadow.floating },
  requestingWrap: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  radarWrap: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  radarRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
  },
  radarCore: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestingTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  requestingSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  summaryText: {
    marginLeft: spacing.xs,
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  cancelSpacing: { marginTop: spacing.xs },
  statusHeader: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  statusTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  statusSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  driverInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  driverName: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingValue: {
    marginLeft: 4,
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  vehicleText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  contactButtonAlt: {
    backgroundColor: colors.accentSoft,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  otpLabel: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  otpChip: {
    flexDirection: 'row',
  },
  otpDigit: {
    width: 26,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    marginLeft: 4,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  tripInfoRow: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  tripInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tripInfoText: {
    marginLeft: spacing.xs,
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    flexShrink: 1,
  },
});
