import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRide } from '../../context/RideContext';
import { paymentMethods } from '../../data/mockData';
import AnimatedPressable from '../../components/AnimatedPressable';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, fontFamily, fontSize, radius, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethods'>;

export default function PaymentMethodsScreen({ navigation }: Props) {
  const { paymentMethodId, selectPayment } = useRide();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Payment methods" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Card padded={false} style={styles.card}>
          {paymentMethods.map((method, i) => {
            const active = method.id === paymentMethodId;
            return (
              <AnimatedPressable
                key={method.id}
                style={[styles.row, i === paymentMethods.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => selectPayment(method.id)}
                scaleTo={0.98}
              >
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name={method.icon as never} size={20} color={colors.primary} />
                </View>
                <Text style={styles.label}>{method.label}</Text>
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={active ? colors.accent : colors.textTertiary}
                />
              </AnimatedPressable>
            );
          })}
        </Card>

        <AnimatedPressable
          style={styles.addButton}
          onPress={() => Alert.alert('Add payment method', 'This is a UI demo — adding new methods isn’t wired up yet.')}
          scaleTo={0.98}
        >
          <Ionicons name="add-circle-outline" size={18} color={colors.accentDark} />
          <Text style={styles.addButtonText}>Add payment method</Text>
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
  label: {
    flex: 1,
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.base,
    color: colors.textPrimary,
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
