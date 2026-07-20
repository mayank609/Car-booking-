export type IconFamily = 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface PlaceLocation extends GeoPoint {
  id: string;
  title: string;
  subtitle: string;
}

export interface RideOption {
  id: string;
  name: string;
  tagline: string;
  iconFamily: IconFamily;
  icon: string;
  capacity: number;
  etaMins: number;
  priceMultiplier: number;
  accentColor: string;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  photoUrl: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleColor: string;
  phone: string;
}

export type RideStatus =
  | 'requesting'
  | 'assigned'
  | 'arriving'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ActiveRide {
  id: string;
  pickup: PlaceLocation;
  drop: PlaceLocation;
  rideOption: RideOption;
  distanceKm: number;
  durationMins: number;
  fare: number;
  status: RideStatus;
  driver: Driver | null;
  otp: string;
  requestedAt: number;
  paymentMethod: PaymentMethod;
  stageStartedAt: number;
  stageDurationMs: number;
  driverStartPoint: GeoPoint | null;
}

export interface PaymentMethod {
  id: string;
  label: string;
  iconFamily: IconFamily;
  icon: string;
}

export interface RideHistoryItem {
  id: string;
  pickupTitle: string;
  dropTitle: string;
  date: string;
  fare: number;
  distanceKm: number;
  rideOptionName: string;
  status: 'completed' | 'cancelled';
  driverName: string;
  rating: number | null;
}
