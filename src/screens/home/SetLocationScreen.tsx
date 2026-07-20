import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRide } from '../../context/RideContext';
import { savedPlaces, searchSuggestions } from '../../data/mockData';
import { PlaceLocation } from '../../data/types';
import AnimatedPressable from '../../components/AnimatedPressable';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, fontFamily, fontSize, radius, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SetLocation'>;

export default function SetLocationScreen({ navigation, route }: Props) {
  const { field } = route.params;
  const { pickup, drop, setPickup, setDrop } = useRide();
  const [query, setQuery] = useState('');

  const allPlaces = useMemo(() => [...savedPlaces, ...searchSuggestions], []);
  const results = useMemo(() => {
    if (!query.trim()) return allPlaces;
    const q = query.toLowerCase();
    return allPlaces.filter(
      (p) => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q),
    );
  }, [query, allPlaces]);

  const otherLocationTitle = field === 'pickup' ? drop?.title : pickup?.title;

  const handleSelect = (place: PlaceLocation) => {
    if (field === 'pickup') {
      setPickup(place);
      navigation.goBack();
    } else {
      setDrop(place);
      navigation.replace('SelectRide');
    }
  };

  const useCurrentLocation = () => {
    if (!pickup) return;
    setPickup({ ...pickup, title: 'Current Location' });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={field === 'pickup' ? 'Set pickup point' : 'Where to?'}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={field === 'pickup' ? 'Search pickup location' : 'Search destination'}
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>

        {otherLocationTitle && (
          <View style={styles.contextRow}>
            <Ionicons name="swap-vertical" size={14} color={colors.textTertiary} />
            <Text style={styles.contextText} numberOfLines={1}>
              {field === 'pickup' ? 'Drop' : 'Pickup'}: {otherLocationTitle}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          field === 'pickup' ? (
            <AnimatedPressable style={styles.currentLocationRow} onPress={useCurrentLocation} scaleTo={0.98}>
              <View style={styles.currentIconWrap}>
                <Ionicons name="navigate" size={16} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.currentLocationTitle}>Use current location</Text>
                <Text style={styles.currentLocationSubtitle}>GPS detected position</Text>
              </View>
            </AnimatedPressable>
          ) : null
        }
        renderItem={({ item }) => (
          <AnimatedPressable style={styles.row} onPress={() => handleSelect(item)} scaleTo={0.98}>
            <View style={styles.rowIcon}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            </View>
            <View style={styles.flexShrink}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.rowSubtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
          </AnimatedPressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchWrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginLeft: spacing.xxs,
  },
  contextText: {
    marginLeft: spacing.xs,
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    flexShrink: 1,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  currentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  currentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  currentLocationTitle: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.accentDark,
  },
  currentLocationSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  flexShrink: { flexShrink: 1 },
  rowTitle: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  rowSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 44,
  },
});
