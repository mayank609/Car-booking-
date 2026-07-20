# Ryda — Cab Booking Customer App (Frontend Demo)

A premium, frontend-only React Native (Expo) customer app for a cab-booking
product like Ola/Uber/Rapido — built for iOS and Android from one codebase.

There is intentionally **no automatic driver-matching**. After a customer
requests a ride, the UI shows a "request sent to our team" waiting state; an
admin is expected to assign a driver from a separate admin panel (not part of
this repo). This app simulates that assignment locally with a timer so the
full flow can be demoed end-to-end without a backend.

## Stack

- Expo SDK 57 + React Native 0.86 + TypeScript
- React Navigation (native-stack + bottom-tabs)
- react-native-maps for the map / route / live marker
- react-native-reanimated + react-native-gesture-handler for animations
- expo-linear-gradient, @expo/vector-icons, Google Fonts (Inter + Poppins)
- All data is local mock data (`src/data/mockData.ts`) and a `useReducer`
  state machine (`src/context/RideContext.tsx`) — no network calls, no backend.

## Getting started

```bash
npm install
npm start        # then press i / a, or scan the QR code with Expo Go
```

## Google Maps API key (Android)

`react-native-maps` needs a Google Maps API key to render map tiles on
**Android** (iOS uses Apple Maps and needs no key). Two placeholders are
already wired up in `app.json`:

```json
"ios": { "config": { "googleMapsApiKey": "YOUR_IOS_GOOGLE_MAPS_API_KEY" } },
"android": { "config": { "googleMaps": { "apiKey": "YOUR_ANDROID_GOOGLE_MAPS_API_KEY" } } }
```

Replace `YOUR_ANDROID_GOOGLE_MAPS_API_KEY` with a real key from the
[Google Cloud Console](https://console.cloud.google.com/) (enable "Maps SDK
for Android"). Without it, the Android map will render blank/grey — the rest
of the UI still works.

## App flow

1. **Onboarding → Login (phone) → OTP** — mock auth, any 10-digit number and
   any 4-digit OTP works (`src/screens/auth`).
2. **Home** — map with pickup pin, "Where to?" search, saved places, and
   suggested destinations (`src/screens/home/HomeScreen.tsx`).
3. **Set location** — search/select pickup or drop (`SetLocationScreen.tsx`).
4. **Select ride** — Bike / Auto / Mini / Sedan / Prime SUV with live fare
   estimates (`SelectRideScreen.tsx`).
5. **Ride status** — "Sending your request to our team" → (simulated admin
   assignment) → driver card, OTP, live-moving driver marker, trip stepper,
   cancel option (`RideStatusScreen.tsx`).
6. **Ride completed** — rating, feedback tags, tip, fare breakdown
   (`RideCompletedScreen.tsx`).
7. **Activity** — ride history with details per trip.
8. **Profile** — payment methods, saved places, settings, help & support.

## Wiring up a real backend later

Everything that would come from a server is centralized in two places:

- `src/data/mockData.ts` — ride options, saved places, driver pool, payment
  methods, ride history seed data.
- `src/context/RideContext.tsx` — the ride lifecycle state machine
  (`requesting → assigned → arriving → arrived → in_progress → completed`).
  Swap the local `setTimeout`-driven `ADVANCE_STAGE` transitions for
  real-time events (e.g. push notifications or a socket) from your admin
  backend, and replace `pickRandomDriver()` with the driver the admin
  actually assigns.
