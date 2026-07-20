import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRide } from '../../context/RideContext';
import { rideOptions } from '../../data/mockData';
import { RideOption } from '../../data/types';
import { formatDuration, haversineDistanceKm } from '../../utils/format';
import AnimatedPressable from '../../components/AnimatedPressable';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, fontFamily, fontSize, radius, shadow, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectRide'>;

export default function SelectRideScreen({ navigation }: Props) {
  const { pickup, drop, selectedRideOptionId, selectRideOption, selectedPaymentMethod, requestRide, estimatedFareLabel } =
    useRide();

  useEffect(() => {
    if (!pickup || !drop) {
      navigation.replace('MainTabs');
    }
  }, [pickup, drop, navigation]);

  if (!pickup || !drop) {
    return null;
  }

  const distanceKm = Math.max(1.2, haversineDistanceKm(pickup, drop) * 1.35);
  const durationMins = (distanceKm / 22) * 60;

  const midLat = (pickup.latitude + drop.latitude) / 2;
  const midLng = (pickup.longitude + drop.longitude) / 2;
  const latDelta = Math.max(0.02, Math.abs(pickup.latitude - drop.latitude) * 1.8);
  const lngDelta = Math.max(0.02, Math.abs(pickup.longitude - drop.longitude) * 1.8);

  const handleConfirm = () => {
    requestRide();
    navigation.replace('RideStatus');
  };

  const renderIcon = (option: RideOption, active: boolean) => {
    const color = active ? colors.white : option.accentColor;
    if (option.iconFamily === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={option.icon as never} size={28} color={color} />;
    }
    return <Ionicons name={option.icon as never} size={28} color={color} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="Choose a ride" subtitle={`${distanceKm.toFixed(1)} km · ${formatDuration(durationMins)}`} onBack={() => navigation.goBack()} />

      <View style={styles.mapWrap}>
        <MapView
          style={StyleSheet.absoluteFill}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          region={{ latitude: midLat, longitude: midLng, latitudeDelta: latDelta, longitudeDelta: lngDelta }}
        >
          <Marker coordinate={pickup} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <View style={styles.pickupMarker} />
          </Marker>
          <Marker coordinate={drop} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <Ionicons name="location" size={30} color={colors.danger} />
          </Marker>
          <Polyline coordinates={[pickup, drop]} strokeColor={colors.primary} strokeWidth={3} lineDashPattern={[8, 6]} />
        </MapView>
      </View>

      <FlatList
        data={rideOptions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const active = item.id === selectedRideOptionId;
          return (
            <AnimatedPressable
              style={[styles.rideCard, active && styles.rideCardActive]}
              onPress={() => selectRideOption(item.id)}
              scaleTo={0.98}
            >
              <View style={[styles.rideIconWrap, { backgroundColor: active ? item.accentColor : `${item.accentColor}1A` }]}>
                {renderIcon(item, active)}
              </View>
              <View style={styles.rideInfo}>
                <Text style={[styles.rideName, active && styles.textOnActive]}>{item.name}</Text>
                <Text style={[styles.rideTagline, active && styles.textOnActiveMuted]} numberOfLines={1}>
                  {item.tagline} · {item.etaMins} min away
                </Text>
              </View>
              <Text style={[styles.ridePrice, active && styles.textOnActive]}>{estimatedFareLabel(item)}</Text>
            </AnimatedPressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />

      <View style={styles.footer}>
        <AnimatedPressable style={styles.paymentRow} scaleTo={0.98}>
          <View style={styles.paymentLeft}>
            <MaterialCommunityIcons name={selectedPaymentMethod.icon as never} size={18} color={colors.primary} />
            <Text style={styles.paymentText}>{selectedPaymentMethod.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </AnimatedPressable>

        <Button label="Confirm Ride Request" onPress={handleConfirm} icon="checkmark-circle" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mapWrap: {
    height: 160,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  pickupMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  rideCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rideIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rideInfo: { flex: 1 },
  rideName: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  rideTagline: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ridePrice: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  textOnActive: { color: colors.white },
  textOnActiveMuted: { color: 'rgba(255,255,255,0.7)' },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    marginLeft: spacing.sm,
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
});
