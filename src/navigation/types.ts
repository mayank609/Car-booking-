export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Otp: { phone: string };
  MainTabs: undefined;
  SetLocation: { field: 'pickup' | 'drop' };
  SelectRide: undefined;
  RideStatus: undefined;
  RideCompleted: undefined;
  RideDetails: { historyId: string };
  PaymentMethods: undefined;
  SavedPlaces: undefined;
  Settings: undefined;
  Help: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ActivityTab: undefined;
  ProfileTab: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
