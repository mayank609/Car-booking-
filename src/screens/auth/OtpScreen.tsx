import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { colors, fontFamily, fontSize, radius, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const OTP_LENGTH = 4;

export default function OtpScreen({ navigation, route }: Props) {
  const { phone } = route.params;
  const { login } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);

  const isComplete = digits.every((d) => d.length === 1);

  useEffect(() => {
    if (seconds === 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChange = (text: string, index: number) => {
    const value = text.replace(/[^0-9]/g, '');
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Verify OTP" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Text style={styles.title}>Enter the code</Text>
        <Text style={styles.subtitle}>
          We've sent a 4-digit verification code to{'\n'}
          <Text style={styles.phone}>+91 {phone}</Text>
        </Text>

        <View style={styles.otpRow}>
          {digits.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => {
                inputs.current[i] = ref;
              }}
              style={[styles.otpBox, digit && styles.otpBoxFilled]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
            />
          ))}
        </View>

        <Text style={styles.resend}>
          {seconds > 0 ? (
            <>Resend code in <Text style={styles.resendActive}>0:{seconds.toString().padStart(2, '0')}</Text></>
          ) : (
            <Text style={styles.resendActive}>Resend code</Text>
          )}
        </Text>

        <View style={styles.footer}>
          <Button label="Verify & Continue" onPress={login} disabled={!isComplete} icon="checkmark-circle" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
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
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  phone: {
    fontFamily: fontFamily.bodySemiBold,
    color: colors.textPrimary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  otpBox: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
  },
  otpBoxFilled: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  resend: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  resendActive: {
    fontFamily: fontFamily.bodySemiBold,
    color: colors.accentDark,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
});
