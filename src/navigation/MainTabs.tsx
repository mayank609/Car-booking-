import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { colors, fontFamily, fontSize } from '../theme';
import HomeScreen from '../screens/home/HomeScreen';
import ActivityScreen from '../screens/activity/ActivityScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  HomeTab: { active: 'home', inactive: 'home-outline' },
  ActivityTab: { active: 'receipt', inactive: 'receipt-outline' },
  ProfileTab: { active: 'person', inactive: 'person-outline' },
};

const LABELS: Record<keyof MainTabParamList, string> = {
  HomeTab: 'Home',
  ActivityTab: 'Activity',
  ProfileTab: 'Profile',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontFamily: fontFamily.bodyMedium, fontSize: fontSize.xs, marginBottom: 4 },
        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const set = ICONS[route.name as keyof MainTabParamList];
          return <Ionicons name={focused ? set.active : set.inactive} size={size ?? 22} color={color} />;
        },
        tabBarLabel: LABELS[route.name as keyof MainTabParamList],
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ActivityTab" component={ActivityScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
