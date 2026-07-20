import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { useRide } from '../../context/RideContext';
import AnimatedPressable from '../../components/AnimatedPressable';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import { colors, fontFamily, fontSize, radius, spacing } from '../../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const menuItems: { key: keyof RootStackParamList; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'PaymentMethods', label: 'Payment methods', icon: 'card-outline' },
  { key: 'SavedPlaces', label: 'Saved places', icon: 'bookmark-outline' },
  { key: 'Settings', label: 'Settings', icon: 'settings-outline' },
  { key: 'Help', label: 'Help & support', icon: 'help-buoy-outline' },
];

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuth();
  const { history } = useRide();

  const completedRides = history.filter((h) => h.status === 'completed').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Avatar uri={user.photoUrl} size={72} />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{completedRides}</Text>
            <Text style={styles.statLabel}>Rides</Text>
          </Card>
          <Card style={styles.statCard}>
            <View style={styles.statValueRow}>
              <Ionicons name="star" size={16} color={colors.amber} />
              <Text style={styles.statValue}> 4.9</Text>
            </View>
            <Text style={styles.statLabel}>Your rating</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>Gold</Text>
            <Text style={styles.statLabel}>Membership</Text>
          </Card>
        </View>

        <Card style={styles.menuCard} padded={false}>
          {menuItems.map((item, i) => (
            <AnimatedPressable
              key={item.key}
              style={[styles.menuRow, i === menuItems.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => navigation.navigate(item.key as never)}
              scaleTo={0.98}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </AnimatedPressable>
          ))}
        </Card>

        <AnimatedPressable style={styles.logoutButton} onPress={logout} scaleTo={0.98}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>Log out</Text>
        </AnimatedPressable>

        <Text style={styles.version}>Ryda Customer App · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerInfo: { marginLeft: spacing.md },
  name: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
  },
  phone: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    marginRight: spacing.sm,
    paddingVertical: spacing.md,
  },
  statValue: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  menuLabel: {
    flex: 1,
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerSoft,
    marginBottom: spacing.lg,
  },
  logoutText: {
    marginLeft: spacing.xs,
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.danger,
  },
  version: {
    textAlign: 'center',
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
});
