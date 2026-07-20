import { Driver, PaymentMethod, PlaceLocation, RideHistoryItem, RideOption } from './types';

// Demo city center — Koramangala, Bengaluru. Swap for any city for the demo.
export const CITY_CENTER = {
  latitude: 12.9352,
  longitude: 77.6146,
};

export const rideOptions: RideOption[] = [
  {
    id: 'bike',
    name: 'Bike',
    tagline: 'Quick two-wheeler rides',
    iconFamily: 'MaterialCommunityIcons',
    icon: 'moped',
    capacity: 1,
    etaMins: 3,
    priceMultiplier: 0.55,
    accentColor: '#00C48C',
  },
  {
    id: 'auto',
    name: 'Auto',
    tagline: 'Affordable three-wheelers',
    iconFamily: 'MaterialCommunityIcons',
    icon: 'rickshaw',
    capacity: 3,
    etaMins: 5,
    priceMultiplier: 0.8,
    accentColor: '#F97316',
  },
  {
    id: 'mini',
    name: 'Mini',
    tagline: 'Compact & budget-friendly',
    iconFamily: 'MaterialCommunityIcons',
    icon: 'car-hatchback',
    capacity: 4,
    etaMins: 6,
    priceMultiplier: 1,
    accentColor: '#3B82F6',
  },
  {
    id: 'sedan',
    name: 'Sedan',
    tagline: 'Comfortable rides, extra space',
    iconFamily: 'MaterialCommunityIcons',
    icon: 'car',
    capacity: 4,
    etaMins: 7,
    priceMultiplier: 1.35,
    accentColor: '#8B5CF6',
  },
  {
    id: 'prime-suv',
    name: 'Prime SUV',
    tagline: 'Premium rides for groups',
    iconFamily: 'MaterialCommunityIcons',
    icon: 'car-estate',
    capacity: 6,
    etaMins: 9,
    priceMultiplier: 1.9,
    accentColor: '#0B1D3A',
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'cash', label: 'Cash', iconFamily: 'MaterialCommunityIcons', icon: 'cash' },
  { id: 'upi', label: 'UPI', iconFamily: 'MaterialCommunityIcons', icon: 'qrcode-scan' },
  { id: 'card', label: 'Card', iconFamily: 'MaterialCommunityIcons', icon: 'credit-card-outline' },
  { id: 'wallet', label: 'Ryda Wallet', iconFamily: 'MaterialCommunityIcons', icon: 'wallet-outline' },
];

export const savedPlaces: PlaceLocation[] = [
  {
    id: 'home',
    title: 'Home',
    subtitle: '221B, Jasmine Meadows, 5th Cross',
    latitude: 12.9352,
    longitude: 77.6146,
  },
  {
    id: 'work',
    title: 'Work',
    subtitle: 'Skyline Tech Park, Outer Ring Road',
    latitude: 12.9569,
    longitude: 77.6963,
  },
];

export const searchSuggestions: PlaceLocation[] = [
  {
    id: 'p1',
    title: 'Forum Mall',
    subtitle: 'Hosur Road, Koramangala',
    latitude: 12.9345,
    longitude: 77.6109,
  },
  {
    id: 'p2',
    title: 'Kempegowda International Airport',
    subtitle: 'Devanahalli, Bengaluru',
    latitude: 13.1986,
    longitude: 77.7066,
  },
  {
    id: 'p3',
    title: 'Indiranagar Metro Station',
    subtitle: '100 Feet Road, Indiranagar',
    latitude: 12.9784,
    longitude: 77.6408,
  },
  {
    id: 'p4',
    title: 'Cubbon Park',
    subtitle: 'Kasturba Road, Bengaluru',
    latitude: 12.9763,
    longitude: 77.5929,
  },
  {
    id: 'p5',
    title: 'Electronic City Phase 1',
    subtitle: 'Hosur Road, Bengaluru',
    latitude: 12.8452,
    longitude: 77.6602,
  },
  {
    id: 'p6',
    title: 'HSR Layout Sector 2',
    subtitle: '27th Main Road, HSR Layout',
    latitude: 12.9116,
    longitude: 77.6389,
  },
];

const driverPool: Driver[] = [
  {
    id: 'd1',
    name: 'Arjun Mehta',
    rating: 4.9,
    totalRides: 3120,
    photoUrl: 'https://i.pravatar.cc/150?img=12',
    vehicleModel: 'Maruti Suzuki Dzire',
    vehiclePlate: 'KA 05 MJ 4821',
    vehicleColor: 'White',
    phone: '+91 98765 43210',
  },
  {
    id: 'd2',
    name: 'Sandeep Rao',
    rating: 4.8,
    totalRides: 2678,
    photoUrl: 'https://i.pravatar.cc/150?img=33',
    vehicleModel: 'Hyundai Aura',
    vehiclePlate: 'KA 03 AB 7742',
    vehicleColor: 'Silver',
    phone: '+91 98450 11234',
  },
  {
    id: 'd3',
    name: 'Imran Sheikh',
    rating: 4.95,
    totalRides: 4501,
    photoUrl: 'https://i.pravatar.cc/150?img=51',
    vehicleModel: 'Honda Activa',
    vehiclePlate: 'KA 41 R 9981',
    vehicleColor: 'Black',
    phone: '+91 99001 22345',
  },
  {
    id: 'd4',
    name: 'Karthik Suresh',
    rating: 4.7,
    totalRides: 1899,
    photoUrl: 'https://i.pravatar.cc/150?img=15',
    vehicleModel: 'Bajaj RE Auto',
    vehiclePlate: 'KA 02 B 3390',
    vehicleColor: 'Yellow & Black',
    phone: '+91 97123 65890',
  },
  {
    id: 'd5',
    name: 'Rohit Bhatia',
    rating: 4.85,
    totalRides: 3985,
    photoUrl: 'https://i.pravatar.cc/150?img=60',
    vehicleModel: 'Toyota Innova Crysta',
    vehiclePlate: 'KA 51 X 5567',
    vehicleColor: 'Grey',
    phone: '+91 96543 21098',
  },
];

export function pickRandomDriver(): Driver {
  return driverPool[Math.floor(Math.random() * driverPool.length)];
}

export function generateOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export const rideHistory: RideHistoryItem[] = [
  {
    id: 'h1',
    pickupTitle: 'Home',
    dropTitle: 'Skyline Tech Park',
    date: 'Today, 9:12 AM',
    fare: 214,
    distanceKm: 8.4,
    rideOptionName: 'Sedan',
    status: 'completed',
    driverName: 'Arjun Mehta',
    rating: 5,
  },
  {
    id: 'h2',
    pickupTitle: 'Forum Mall',
    dropTitle: 'Indiranagar Metro Station',
    date: 'Yesterday, 7:48 PM',
    fare: 96,
    distanceKm: 4.1,
    rideOptionName: 'Mini',
    status: 'completed',
    driverName: 'Sandeep Rao',
    rating: 4,
  },
  {
    id: 'h3',
    pickupTitle: 'Cubbon Park',
    dropTitle: 'HSR Layout Sector 2',
    date: '2 days ago, 11:05 AM',
    fare: 58,
    distanceKm: 3.2,
    rideOptionName: 'Auto',
    status: 'completed',
    driverName: 'Karthik Suresh',
    rating: 5,
  },
  {
    id: 'h4',
    pickupTitle: 'Home',
    dropTitle: 'Electronic City Phase 1',
    date: '4 days ago, 6:30 PM',
    fare: 0,
    distanceKm: 14.7,
    rideOptionName: 'Prime SUV',
    status: 'cancelled',
    driverName: '—',
    rating: null,
  },
  {
    id: 'h5',
    pickupTitle: 'Work',
    dropTitle: 'Kempegowda Airport',
    date: '6 days ago, 5:15 AM',
    fare: 612,
    distanceKm: 34.9,
    rideOptionName: 'Prime SUV',
    status: 'completed',
    driverName: 'Rohit Bhatia',
    rating: 5,
  },
];
