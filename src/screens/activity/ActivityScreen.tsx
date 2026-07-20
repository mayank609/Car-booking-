import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRide } from '../../context/RideContext';
import { RideHistoryItem } from '../../data/types';
import { formatCurrency } from '../../utils/format';
import AnimatedPressable from '../../components/AnimatedPressable';
import Card from '../../components/Card';
import RatingStars from '../../components/RatingStars';
import { colors, fontFamily, fontSize, radius, spacing } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ActivityScreen() {
  const navigation = useNavigation<Nav>();
  const { history } = useRide();

  const renderItem = ({ item }: { item: RideHistoryItem }) => {
    const isCancelled = item.status === 'cancelled';
    return (
      <AnimatedPressable
        onPress={() => navigation.navigate('RideDetails', { historyId: item.id })}
        scaleTo={0.98}
      >
        <Card style={styles.card}>
          <View style={styles.rowTop}>
            <View style={styles.iconWrap}>
              <Ionicons name={isCancelled ? 'close-circle' : 'checkmark-circle'} size={20} color={isCancelled ? colors.danger : colors.accent} />
            </View>
            <View style={styles.flexShrink}>
              <Text style={styles.route} numberOfLines={1}>
                {item.pickupTitle} → {item.dropTitle}
              </Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={[styles.fare, isCancelled && styles.fareCancelled]}>
              {isCancelled ? 'Cancelled' : formatCurrency(item.fare)}
            </Text>
          </View>

          <View style={styles.rowBottom}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.rideOptionName}</Text>
            </View>
            <Text style={styles.distance}>{item.distanceKm.toFixed(1)} km</Text>
            {item.rating && <RatingStars rating={item.rating} size={12} />}
          </View>
        </Card>
      </AnimatedPressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your rides</Text>
        <Text style={styles.subtitle}>{history.length} trips with Ryda</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {},
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    marginRight: spacing.sm,
  },
  flexShrink: { flex: 1 },
  route: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  date: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  fare: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  fareCancelled: {
    color: colors.danger,
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.sm,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  badge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },
  badgeText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  distance: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginRight: 'auto',
  },
});
