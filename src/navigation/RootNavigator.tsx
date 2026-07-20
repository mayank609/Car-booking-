import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';
import MainTabs from './MainTabs';

import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';

import SetLocationScreen from '../screens/home/SetLocationScreen';
import SelectRideScreen from '../screens/home/SelectRideScreen';
import RideStatusScreen from '../screens/home/RideStatusScreen';
import RideCompletedScreen from '../screens/home/RideCompletedScreen';
import RideDetailsScreen from '../screens/activity/RideDetailsScreen';

import PaymentMethodsScreen from '../screens/profile/PaymentMethodsScreen';
import SavedPlacesScreen from '../screens/profile/SavedPlacesScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import HelpScreen from '../screens/profile/HelpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="SetLocation"
            component={SetLocationScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="SelectRide" component={SelectRideScreen} />
          <Stack.Screen name="RideStatus" component={RideStatusScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen
            name="RideCompleted"
            component={RideCompletedScreen}
            options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
          />
          <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
          <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
          <Stack.Screen name="SavedPlaces" component={SavedPlacesScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
