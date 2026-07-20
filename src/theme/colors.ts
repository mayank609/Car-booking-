export const colors = {
  // Brand
  primary: '#0B1D3A', // deep navy — headers, dark surfaces, map chrome
  primaryLight: '#16294D',
  accent: '#00C48C', // emerald — primary CTAs, active/confirm states
  accentDark: '#00A876',
  accentSoft: '#E4FBF3',
  amber: '#FFB020', // ratings, premium badges
  amberSoft: '#FFF3DE',

  // Neutrals
  background: '#F6F8FC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F3F9',
  border: '#E8EAF1',
  borderStrong: '#D7DBE6',

  // Text
  textPrimary: '#10162B',
  textSecondary: '#666E85',
  textTertiary: '#9AA1B4',
  textInverse: '#FFFFFF',

  // Status
  success: '#22C55E',
  successSoft: '#E9FAEF',
  danger: '#EF4444',
  dangerSoft: '#FDEBEB',
  info: '#3B82F6',
  infoSoft: '#EAF1FF',

  // Utility
  overlay: 'rgba(11, 29, 58, 0.55)',
  shimmer: '#EDEFF5',
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',

  // Ride type accents (bike/auto/mini/sedan/suv)
  rideAccents: ['#00C48C', '#3B82F6', '#F97316', '#8B5CF6', '#0B1D3A'],
};

export type ColorKey = keyof typeof colors;
