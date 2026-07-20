import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Button from '../../components/Button';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const isValid = phone.length === 10;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.iconCircle}>
          <Ionicons name="car-sport" size={40} color={colors.accent} />
        </View>

        <Text style={styles.title}>Let's get you moving</Text>
        <Text style={styles.subtitle}>Enter your mobile number to sign in or create a new account.</Text>

        <View style={styles.inputRow}>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>🇮🇳 +91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="00000 00000"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ''))}
          />
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to Ryda's{' '}
          <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>.
        </Text>

        <View style={styles.footer}>
          <Button
            label="Continue"
            onPress={() => navigation.navigate('Otp', { phone })}
            disabled={!isValid}
            icon="arrow-forward"
            iconPosition="right"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  flex: { flex: 1 },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    lineHeight: lineHeight.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    marginBottom: spacing.md,
  },
  codeBox: {
    height: 58,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  codeText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  input: {
    flex: 1,
    height: 58,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  terms: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.sm,
    color: colors.textTertiary,
  },
  link: {
    color: colors.accentDark,
    fontFamily: fontFamily.bodyMedium,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
});
