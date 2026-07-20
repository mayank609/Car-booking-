import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { savedPlaces } from '../../data/mockData';
import AnimatedPressable from '../../components/AnimatedPressable';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, fontFamily, fontSize, radius, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedPlaces'>;

export default function SavedPlacesScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Saved places" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Card padded={false} style={styles.card}>
          {savedPlaces.map((place, i) => (
            <View key={place.id} style={[styles.row, i === savedPlaces.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.iconWrap}>
                <Ionicons name={place.id === 'home' ? 'home' : 'briefcase'} size={18} color={colors.primary} />
              </View>
              <View style={styles.flexShrink}>
                <Text style={styles.placeTitle}>{place.title}</Text>
                <Text style={styles.placeSubtitle} numberOfLines={1}>
                  {place.subtitle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </View>
          ))}
        </Card>

        <AnimatedPressable
          style={styles.addButton}
          onPress={() => Alert.alert('Add a place', 'This is a UI demo — adding new saved places isn’t wired up yet.')}
          scaleTo={0.98}
        >
          <Ionicons name="add-circle-outline" size={18} color={colors.accentDark} />
          <Text style={styles.addButtonText}>Add new place</Text>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  card: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  flexShrink: { flex: 1 },
  placeTitle: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  placeSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  addButtonText: {
    marginLeft: spacing.xs,
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.accentDark,
  },
});
