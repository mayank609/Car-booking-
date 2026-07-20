import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  ActiveRide,
  GeoPoint,
  PaymentMethod,
  PlaceLocation,
  RideHistoryItem,
  RideOption,
  RideStatus,
} from '../data/types';
import { paymentMethods, pickRandomDriver, generateOtp, rideHistory, rideOptions } from '../data/mockData';
import { estimateDurationMins, estimateFare, formatCurrency, haversineDistanceKm } from '../utils/format';

const STAGE_SEQUENCE: RideStatus[] = ['requesting', 'assigned', 'arriving', 'arrived', 'in_progress', 'completed'];

const STAGE_DURATIONS_MS: Record<RideStatus, number> = {
  requesting: 4500, // simulated time for admin to review & assign a driver
  assigned: 1800,
  arriving: 7000,
  arrived: 3500,
  in_progress: 8000,
  completed: Number.POSITIVE_INFINITY,
  cancelled: Number.POSITIVE_INFINITY,
};

interface RideState {
  pickup: PlaceLocation | null;
  drop: PlaceLocation | null;
  selectedRideOptionId: string;
  paymentMethodId: string;
  activeRide: ActiveRide | null;
  history: RideHistoryItem[];
  lastCancelled: boolean;
}

type Action =
  | { type: 'SET_PICKUP'; payload: PlaceLocation }
  | { type: 'SET_DROP'; payload: PlaceLocation }
  | { type: 'SWAP_LOCATIONS' }
  | { type: 'SELECT_RIDE_OPTION'; payload: string }
  | { type: 'SELECT_PAYMENT'; payload: string }
  | { type: 'REQUEST_RIDE' }
  | { type: 'ADVANCE_STAGE' }
  | { type: 'CANCEL_RIDE' }
  | { type: 'FINISH_RIDE_FEEDBACK'; payload: { rating: number; tip: number } }
  | { type: 'RESET_BOOKING' }
  | { type: 'CLEAR_CANCEL_FLAG' };

function randomNearbyPoint(center: GeoPoint, maxKm: number): GeoPoint {
  const radiusInDegrees = maxKm / 111;
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * radiusInDegrees;
  return {
    latitude: center.latitude + distance * Math.cos(angle),
    longitude: center.longitude + distance * Math.sin(angle),
  };
}

function buildActiveRide(pickup: PlaceLocation, drop: PlaceLocation, rideOption: RideOption, paymentMethod: PaymentMethod): ActiveRide {
  const distanceKm = Math.max(1.2, haversineDistanceKm(pickup, drop) * 1.35); // road-distance fudge factor
  const durationMins = estimateDurationMins(distanceKm);
  const fare = estimateFare(distanceKm, rideOption.priceMultiplier);

  return {
    id: `ride_${Date.now()}`,
    pickup,
    drop,
    rideOption,
    distanceKm,
    durationMins,
    fare,
    status: 'requesting',
    driver: null,
    otp: generateOtp(),
    requestedAt: Date.now(),
    paymentMethod,
    stageStartedAt: Date.now(),
    stageDurationMs: STAGE_DURATIONS_MS.requesting,
    driverStartPoint: null,
  };
}

const initialState: RideState = {
  pickup: null,
  drop: null,
  selectedRideOptionId: rideOptions[0].id,
  paymentMethodId: paymentMethods[0].id,
  activeRide: null,
  history: rideHistory,
  lastCancelled: false,
};

function reducer(state: RideState, action: Action): RideState {
  switch (action.type) {
    case 'SET_PICKUP':
      return { ...state, pickup: action.payload };
    case 'SET_DROP':
      return { ...state, drop: action.payload };
    case 'SWAP_LOCATIONS':
      return { ...state, pickup: state.drop, drop: state.pickup };
    case 'SELECT_RIDE_OPTION':
      return { ...state, selectedRideOptionId: action.payload };
    case 'SELECT_PAYMENT':
      return { ...state, paymentMethodId: action.payload };
    case 'REQUEST_RIDE': {
      if (!state.pickup || !state.drop) return state;
      const rideOption = rideOptions.find((r) => r.id === state.selectedRideOptionId) ?? rideOptions[0];
      const paymentMethod = paymentMethods.find((p) => p.id === state.paymentMethodId) ?? paymentMethods[0];
      const activeRide = buildActiveRide(state.pickup, state.drop, rideOption, paymentMethod);
      return { ...state, activeRide };
    }
    case 'ADVANCE_STAGE': {
      if (!state.activeRide) return state;
      const currentIndex = STAGE_SEQUENCE.indexOf(state.activeRide.status);
      const nextStatus = STAGE_SEQUENCE[currentIndex + 1];
      if (!nextStatus) return state;

      let driver = state.activeRide.driver;
      let driverStartPoint = state.activeRide.driverStartPoint;
      if (nextStatus === 'assigned') {
        driver = pickRandomDriver();
        driverStartPoint = randomNearbyPoint(state.activeRide.pickup, 2.2);
      }

      return {
        ...state,
        activeRide: {
          ...state.activeRide,
          status: nextStatus,
          driver,
          driverStartPoint,
          stageStartedAt: Date.now(),
          stageDurationMs: STAGE_DURATIONS_MS[nextStatus],
        },
      };
    }
    case 'CANCEL_RIDE': {
      if (!state.activeRide) return state;
      const cancelledEntry: RideHistoryItem = {
        id: state.activeRide.id,
        pickupTitle: state.activeRide.pickup.title,
        dropTitle: state.activeRide.drop.title,
        date: 'Just now',
        fare: 0,
        distanceKm: state.activeRide.distanceKm,
        rideOptionName: state.activeRide.rideOption.name,
        status: 'cancelled',
        driverName: state.activeRide.driver?.name ?? '—',
        rating: null,
      };
      return {
        ...state,
        activeRide: null,
        pickup: null,
        drop: null,
        history: [cancelledEntry, ...state.history],
        lastCancelled: true,
      };
    }
    case 'FINISH_RIDE_FEEDBACK': {
      if (!state.activeRide) return state;
      const completedEntry: RideHistoryItem = {
        id: state.activeRide.id,
        pickupTitle: state.activeRide.pickup.title,
        dropTitle: state.activeRide.drop.title,
        date: 'Just now',
        fare: state.activeRide.fare + action.payload.tip,
        distanceKm: state.activeRide.distanceKm,
        rideOptionName: state.activeRide.rideOption.name,
        status: 'completed',
        driverName: state.activeRide.driver?.name ?? '—',
        rating: action.payload.rating,
      };
      return {
        ...state,
        activeRide: null,
        pickup: null,
        drop: null,
        history: [completedEntry, ...state.history],
      };
    }
    case 'RESET_BOOKING':
      return { ...state, pickup: null, drop: null, activeRide: null };
    case 'CLEAR_CANCEL_FLAG':
      return { ...state, lastCancelled: false };
    default:
      return state;
  }
}

interface RideContextValue extends RideState {
  setPickup: (place: PlaceLocation) => void;
  setDrop: (place: PlaceLocation) => void;
  swapLocations: () => void;
  selectRideOption: (id: string) => void;
  selectPayment: (id: string) => void;
  requestRide: () => void;
  cancelRide: () => void;
  finishRideFeedback: (rating: number, tip: number) => void;
  resetBooking: () => void;
  clearCancelFlag: () => void;
  selectedRideOption: RideOption;
  selectedPaymentMethod: PaymentMethod;
  estimatedFareLabel: (option: RideOption) => string;
}

const RideContext = createContext<RideContextValue | undefined>(undefined);

export function RideProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const ride = state.activeRide;
    if (!ride || ride.status === 'completed' || ride.status === 'cancelled') return;

    timerRef.current = setTimeout(() => {
      dispatch({ type: 'ADVANCE_STAGE' });
    }, ride.stageDurationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.activeRide?.status, state.activeRide?.id]);

  const selectedRideOption = useMemo(
    () => rideOptions.find((r) => r.id === state.selectedRideOptionId) ?? rideOptions[0],
    [state.selectedRideOptionId],
  );
  const selectedPaymentMethod = useMemo(
    () => paymentMethods.find((p) => p.id === state.paymentMethodId) ?? paymentMethods[0],
    [state.paymentMethodId],
  );

  const estimatedFareLabel = useCallback(
    (option: RideOption) => {
      if (!state.pickup || !state.drop) return '';
      const distanceKm = Math.max(1.2, haversineDistanceKm(state.pickup, state.drop) * 1.35);
      return formatCurrency(estimateFare(distanceKm, option.priceMultiplier));
    },
    [state.pickup, state.drop],
  );

  const value: RideContextValue = {
    ...state,
    setPickup: (place) => dispatch({ type: 'SET_PICKUP', payload: place }),
    setDrop: (place) => dispatch({ type: 'SET_DROP', payload: place }),
    swapLocations: () => dispatch({ type: 'SWAP_LOCATIONS' }),
    selectRideOption: (id) => dispatch({ type: 'SELECT_RIDE_OPTION', payload: id }),
    selectPayment: (id) => dispatch({ type: 'SELECT_PAYMENT', payload: id }),
    requestRide: () => dispatch({ type: 'REQUEST_RIDE' }),
    cancelRide: () => dispatch({ type: 'CANCEL_RIDE' }),
    finishRideFeedback: (rating, tip) => dispatch({ type: 'FINISH_RIDE_FEEDBACK', payload: { rating, tip } }),
    resetBooking: () => dispatch({ type: 'RESET_BOOKING' }),
    clearCancelFlag: () => dispatch({ type: 'CLEAR_CANCEL_FLAG' }),
    selectedRideOption,
    selectedPaymentMethod,
    estimatedFareLabel,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
}

export function useRide(): RideContextValue {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error('useRide must be used within RideProvider');
  return ctx;
}
