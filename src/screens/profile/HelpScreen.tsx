import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import AnimatedPressable from '../../components/AnimatedPressable';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, fontFamily, fontSize, spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Help'>;

const faqs = [
  {
    q: 'How is my driver assigned?',
    a: 'Once you request a ride, our team reviews the request and personally assigns the best available driver for your trip — this usually takes a few moments.',
  },
  {
    q: 'How do I cancel a ride?',
    a: 'You can cancel anytime before the trip starts from the ride tracking screen using the "Cancel Ride" button.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'Ryda supports Cash, UPI, Credit/Debit cards, and the Ryda Wallet. You can change your default method before requesting a ride.',
  },
  {
    q: 'Is my OTP required for every ride?',
    a: 'Yes, share the 4-digit OTP with your driver only after they arrive, to confirm the correct ride is starting.',
  },
];

export default function HelpScreen({ navigation }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Help & support" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Frequently asked questions</Text>
        {faqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <Card key={faq.q} style={styles.faqCard}>
              <AnimatedPressable
                style={styles.faqHeader}
                onPress={() => setOpenIndex(open ? null : i)}
                scaleTo={0.99}
              >
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
              </AnimatedPressable>
              {open && <Text style={styles.faqAnswer}>{faq.a}</Text>}
            </Card>
          );
        })}

        <Text style={styles.sectionLabel}>Still need help?</Text>
        <Card style={styles.contactCard}>
          <Ionicons name="headset" size={28} color={colors.accent} />
          <Text style={styles.contactTitle}>Our support team is here for you</Text>
          <Text style={styles.contactSubtitle}>Available 24/7 for ride issues, billing, and feedback.</Text>
          <Button
            label="Email Support"
            variant="secondary"
            icon="mail-outline"
            onPress={() => Linking.openURL('mailto:support@ryda.app')}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  sectionLabel: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  faqCard: { marginBottom: spacing.sm },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  faqAnswer: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  contactCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  contactTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
});
