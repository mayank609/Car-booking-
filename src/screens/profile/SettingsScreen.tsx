import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, fontFamily, fontSize, radius, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [promoEnabled, setPromoEnabled] = useState(false);

  const rows = [
    { key: 'push', icon: 'notifications-outline' as const, label: 'Push notifications', value: pushEnabled, onChange: setPushEnabled },
    { key: 'sms', icon: 'chatbox-outline' as const, label: 'Ride updates via SMS', value: smsEnabled, onChange: setSmsEnabled },
    { key: 'promo', icon: 'pricetag-outline' as const, label: 'Promotions & offers', value: promoEnabled, onChange: setPromoEnabled },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Notifications</Text>
        <Card padded={false} style={styles.card}>
          {rows.map((row, i) => (
            <View key={row.key} style={[styles.row, i === rows.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.iconWrap}>
                <Ionicons name={row.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.label}>{row.label}</Text>
              <Switch
                value={row.value}
                onValueChange={row.onChange}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </Card>

        <Text style={styles.sectionLabel}>About</Text>
        <Card padded={false} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>App version</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  sectionLabel: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
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
  label: {
    flex: 1,
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  value: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
