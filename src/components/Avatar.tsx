import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '../theme';

interface Props {
  uri?: string;
  name?: string;
  size?: number;
}

export default function Avatar({ uri, name, size = 48 }: Props) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, dimension]} />;
  }

  const initials = (name ?? '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.fallback, dimension]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceAlt,
  },
  fallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontFamily: fontFamily.headingMedium,
  },
});
