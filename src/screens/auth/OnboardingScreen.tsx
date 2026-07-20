import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Button from '../../components/Button';
import { colors, fontFamily, fontSize, lineHeight, spacing } from '../../theme';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const slides = [
  {
    key: 'book',
    icon: 'flash' as const,
    iconFamily: 'ionicons' as const,
    title: 'Your ride,\non demand',
    description: 'Book a bike, auto, or cab in seconds and get moving — anytime, anywhere.',
  },
  {
    key: 'assigned',
    icon: 'shield-check' as const,
    iconFamily: 'mci' as const,
    title: 'Handpicked\ndrivers, every time',
    description: 'Every ride request is personally reviewed and assigned by our team for your safety.',
  },
  {
    key: 'choice',
    icon: 'car-multiple' as const,
    iconFamily: 'mci' as const,
    title: 'Ride your way,\nfor less',
    description: 'Choose from Bike to Prime SUV with clear, upfront fares — no surprises.',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== index) setIndex(newIndex);
  };

  const goNext = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.skipRow}>
          <Text style={styles.brand}>Ryda</Text>
          <Text onPress={() => navigation.replace('Login')} style={styles.skip}>
            Skip
          </Text>
        </View>

        <FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <View style={styles.iconCircle}>
                {item.iconFamily === 'ionicons' ? (
                  <Ionicons name={item.icon} size={64} color={colors.accent} />
                ) : (
                  <MaterialCommunityIcons name={item.icon} size={64} color={colors.accent} />
                )}
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />

        <View style={styles.dotsRow}>
          {slides.map((slide, i) => (
            <View key={slide.key} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.footer}>
          <Button label={index === slides.length - 1 ? 'Get Started' : 'Next'} onPress={goNext} icon="arrow-forward" iconPosition="right" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  brand: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.xl,
    color: colors.white,
  },
  skip: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.7)',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,196,140,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontFamily: fontFamily.headingBold,
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    lineHeight: lineHeight.lg,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.24)',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.accent,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
