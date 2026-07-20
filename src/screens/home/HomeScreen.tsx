import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { RootStackParamList } from '../../navigation/types';
import { useRide } from '../../context/RideContext';
import { useAuth } from '../../context/AuthContext';
import { CITY_CENTER, savedPlaces, searchSuggestions } from '../../data/mockData';
import AnimatedPressable from '../../components/AnimatedPressable';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import { colors, fontFamily, fontSize, radius, shadow, spacing } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const nearbyCars = [
  { id: 'c1', latitude: CITY_CENTER.latitude + 0.004, longitude: CITY_CENTER.longitude + 0.003, rotation: 40 },
  { id: 'c2', latitude: CITY_CENTER.latitude - 0.003, longitude: CITY_CENTER.longitude + 0.006, rotation: 160 },
  { id: 'c3', latitude: CITY_CENTER.latitude + 0.002, longitude: CITY_CENTER.longitude - 0.005, rotation: 260 },
  { id: 'c4', latitude: CITY_CENTER.latitude - 0.006, longitude: CITY_CENTER.longitude - 0.002, rotation: 90 },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { pickup, setPickup, setDrop } = useRide();
  const { user } = useAuth();
  const [region, setRegion] = useState({
    ...CITY_CENTER,
    latitudeDelta: 0.035,
    longitudeDelta: 0.035,
  });

  const pulse = useSharedValue(0.6);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.8, { duration: 1800 }), -1, false);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 1 - (pulse.value - 0.6) / 1.2,
  }));

  useEffect(() => {
    if (pickup) return;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({});
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setRegion((r) => ({ ...r, ...coords }));
          setPickup({ id: 'current', title: 'Current Location', subtitle: 'Detected via GPS', ...coords });
          return;
        }
      } catch {
        // fall through to default demo location
      }
      setPickup({
        id: 'current',
        title: 'Current Location',
        subtitle: 'Koramangala, Bengaluru',
        ...CITY_CENTER,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToDrop = (place?: (typeof searchSuggestions)[number]) => {
    if (place) {
      setDrop(place);
      navigation.navigate('SelectRide');
    } else {
      navigation.navigate('SetLocation', { field: 'drop' });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        region={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {pickup && (
          <Marker coordinate={pickup} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <View style={styles.markerWrap}>
              <Animated.View style={[styles.pulseRing, pulseStyle]} />
              <View style={styles.pickupDot} />
            </View>
          </Marker>
        )}
        {nearbyCars.map((car) => (
          <Marker key={car.id} coordinate={car} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <View style={[styles.carMarker, { transform: [{ rotate: `${car.rotation}deg` }] }]}>
              <MaterialCommunityIcons name="car" size={16} color={colors.white} />
            </View>
          </Marker>
        ))}
      </MapView>

      <SafeAreaView style={styles.topBar} edges={['top']}>
        <AnimatedPressable style={styles.avatarButton} onPress={() => navigation.navigate('MainTabs')} scaleTo={0.9}>
          <Avatar uri={user.photoUrl} size={44} />
        </AnimatedPressable>
        <AnimatedPressable style={styles.bellButton} scaleTo={0.9}>
          <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
        </AnimatedPressable>
      </SafeAreaView>

      <View style={styles.sheet}>
        <Card style={styles.sheetCard} elevated={false}>
          <Text style={styles.greeting}>Hi {user.name.split(' ')[0]} 👋</Text>
          <Text style={styles.headline}>Where are you headed?</Text>

          <AnimatedPressable
            style={styles.locationRow}
            onPress={() => navigation.navigate('SetLocation', { field: 'pickup' })}
            scaleTo={0.98}
          >
            <View style={styles.dotAccent} />
            <Text style={styles.locationText} numberOfLines={1}>
              {pickup?.title ?? 'Detecting location…'}
            </Text>
          </AnimatedPressable>

          <View style={styles.divider} />

          <AnimatedPressable style={styles.locationRow} onPress={() => goToDrop()} scaleTo={0.98}>
            <Ionicons name="search" size={16} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />
            <Text style={styles.placeholderText}>Search for a destination</Text>
          </AnimatedPressable>

          <View style={styles.quickRow}>
            {savedPlaces.map((place) => (
              <AnimatedPressable key={place.id} style={styles.quickChip} onPress={() => goToDrop(place)} scaleTo={0.95}>
                <Ionicons
                  name={place.id === 'home' ? 'home' : 'briefcase'}
                  size={14}
                  color={colors.primary}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.quickChipText}>{place.title}</Text>
              </AnimatedPressable>
            ))}
          </View>
        </Card>

        <Card style={styles.recentCard}>
          <Text style={styles.recentTitle}>Suggested destinations</Text>
          {searchSuggestions.slice(0, 3).map((place, i) => (
            <AnimatedPressable
              key={place.id}
              style={[styles.recentRow, i === 2 && { borderBottomWidth: 0 }]}
              onPress={() => goToDrop(place)}
              scaleTo={0.98}
            >
              <View style={styles.recentIcon}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              </View>
              <View style={styles.flexShrink}>
                <Text style={styles.recentPlaceTitle} numberOfLines={1}>
                  {place.title}
                </Text>
                <Text style={styles.recentPlaceSubtitle} numberOfLines={1}>
                  {place.subtitle}
                </Text>
              </View>
            </AnimatedPressable>
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  avatarButton: {
    borderRadius: radius.pill,
    ...shadow.floating,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },
  markerWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
  },
  pickupDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.white,
  },
  carMarker: {
    width: 26,
    height: 26,
    borderRadius: 13,
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
  sheetCard: {
    marginBottom: spacing.sm,
    ...shadow.floating,
  },
  greeting: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  headline: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dotAccent: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginRight: spacing.sm,
    marginLeft: 3,
  },
  locationText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  placeholderText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 13,
  },
  quickRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },
  quickChipText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  recentCard: {
    ...shadow.card,
  },
  recentTitle: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  flexShrink: { flexShrink: 1 },
  recentPlaceTitle: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  recentPlaceSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
