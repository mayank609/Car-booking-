import { GeoPoint } from '../data/types';

export function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function formatDuration(mins: number): string {
  if (mins < 60) return `${Math.round(mins)} min`;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h}h ${m}m`;
}

export function haversineDistanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function estimateFare(distanceKm: number, priceMultiplier: number): number {
  const base = 35;
  const perKm = 12;
  const fare = base + distanceKm * perKm * priceMultiplier;
  return Math.max(base, Math.round(fare / 5) * 5);
}

export function estimateDurationMins(distanceKm: number): number {
  const avgSpeedKmph = 22;
  return Math.max(4, (distanceKm / avgSpeedKmph) * 60);
}

export function interpolate(a: GeoPoint, b: GeoPoint, t: number): GeoPoint {
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * t,
    longitude: a.longitude + (b.longitude - a.longitude) * t,
  };
}
