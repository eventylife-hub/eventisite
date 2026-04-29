import { Injectable } from '@nestjs/common';

export interface Stop {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  kindof: 'departure' | 'pause' | 'meal' | 'hotel' | 'activity' | 'destination';
  durationMinutes?: number;
  scheduledAt?: Date;
}

export interface Activity {
  id: string;
  title: string;
  city: string;
  durationMinutes: number;
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  hraId?: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  checkIn: string;
  checkOut: string;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

export interface ItineraryInput {
  travelId: string;
  departureAt: Date;
  returnAt: Date;
  passengersCount: number;
  stops: Stop[];
  activities: Activity[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  busSpeedKmh?: number;
}

export interface ItineraryDayItem {
  startAt: Date;
  endAt: Date;
  type: 'transit' | 'pause' | 'meal' | 'check-in' | 'check-out' | 'activity' | 'free-time';
  title: string;
  description: string;
  city?: string;
  refId?: string;
}

export interface ItineraryDay {
  index: number;
  date: string;
  city: string;
  summary: string;
  items: ItineraryDayItem[];
}

export interface GeneratedItinerary {
  travelId: string;
  totalDays: number;
  totalDistanceKm: number;
  totalTransitMinutes: number;
  days: ItineraryDay[];
  generatedAt: Date;
}

const EARTH_RADIUS_KM = 6371;
const PAUSE_EVERY_HOURS = 4.5;
const PAUSE_DURATION_MIN = 45;
const BREAKFAST_HOUR = 8;
const LUNCH_HOUR = 12.5;
const DINNER_HOUR = 19.5;
const HOTEL_CHECKIN_HOUR = 15;
const HOTEL_CHECKOUT_HOUR = 11;
const DEFAULT_BUS_SPEED = 70;

@Injectable()
export class ItineraryGeneratorService {
  generate(input: ItineraryInput): GeneratedItinerary {
    const speed = input.busSpeedKmh ?? DEFAULT_BUS_SPEED;
    const days: ItineraryDay[] = [];
    let currentTime = new Date(input.departureAt);
    let totalDistanceKm = 0;
    let totalTransitMinutes = 0;

    const orderedStops = this.sortStopsByJourney(input.stops);

    let dayIndex = 0;
    let dayItems: ItineraryDayItem[] = [];
    let currentDayDate = this.toIsoDate(currentTime);
    let currentCity = orderedStops[0]?.city ?? '—';

    const pushDay = () => {
      days.push({
        index: dayIndex,
        date: currentDayDate,
        city: currentCity,
        summary: this.summarize(dayItems),
        items: dayItems,
      });
      dayIndex += 1;
      dayItems = [];
    };

    for (let i = 0; i < orderedStops.length - 1; i += 1) {
      const from = orderedStops[i];
      const to = orderedStops[i + 1];

      // 1. Transit
      const distanceKm = this.haversineKm(from, to);
      const rawTransitMin = (distanceKm / speed) * 60;
      const pausesNeeded = Math.floor(rawTransitMin / 60 / PAUSE_EVERY_HOURS);
      const transitMin = rawTransitMin + pausesNeeded * PAUSE_DURATION_MIN;
      totalDistanceKm += distanceKm;
      totalTransitMinutes += transitMin;

      const transitEnd = new Date(currentTime.getTime() + transitMin * 60_000);
      dayItems.push({
        startAt: new Date(currentTime),
        endAt: transitEnd,
        type: 'transit',
        title: `Trajet ${from.city} → ${to.city}`,
        description: `${Math.round(distanceKm)} km · ${this.formatDuration(transitMin)} · ${pausesNeeded} pause(s) chauffeur`,
        city: to.city,
      });

      // 2. Repas si on franchit l'heure de repas pendant le trajet
      const startHour = currentTime.getHours() + currentTime.getMinutes() / 60;
      const endHour = transitEnd.getHours() + transitEnd.getMinutes() / 60;
      if (startHour < LUNCH_HOUR && endHour >= LUNCH_HOUR) {
        const lunchTime = this.atHour(transitEnd, LUNCH_HOUR);
        const restaurant = input.restaurants.find(
          (r) => r.mealType === 'lunch' && r.city === to.city,
        );
        dayItems.push({
          startAt: lunchTime,
          endAt: this.addMinutes(lunchTime, 75),
          type: 'meal',
          title: 'Déjeuner',
          description: restaurant ? `Chez ${restaurant.name}` : 'Pause déjeuner sur le trajet',
          city: to.city,
          refId: restaurant?.id,
        });
      }

      currentTime = transitEnd;
      currentCity = to.city;

      // 3. Si arrivée hôtel et qu'il est 15h+ → check-in
      if (to.kindof === 'hotel') {
        const hotel = input.hotels.find((h) => h.city === to.city);
        const checkInTime = this.atHour(currentTime, HOTEL_CHECKIN_HOUR);
        const realCheckIn = currentTime > checkInTime ? currentTime : checkInTime;

        dayItems.push({
          startAt: realCheckIn,
          endAt: this.addMinutes(realCheckIn, 30),
          type: 'check-in',
          title: "Arrivée à l'hôtel",
          description: hotel ? `Check-in ${hotel.name}` : 'Check-in hôtel',
          city: to.city,
          refId: hotel?.id,
        });

        currentTime = this.addMinutes(realCheckIn, 30);

        // Activités après-midi (si reste du temps)
        const remainingHours = DINNER_HOUR - (currentTime.getHours() + currentTime.getMinutes() / 60);
        if (remainingHours >= 1.5) {
          const afternoonActivity = input.activities.find(
            (a) => a.city === to.city && a.preferredTimeOfDay !== 'evening',
          );
          if (afternoonActivity) {
            dayItems.push({
              startAt: new Date(currentTime),
              endAt: this.addMinutes(currentTime, afternoonActivity.durationMinutes),
              type: 'activity',
              title: afternoonActivity.title,
              description: 'Activité incluse dans le voyage',
              city: to.city,
              refId: afternoonActivity.id,
            });
            currentTime = this.addMinutes(currentTime, afternoonActivity.durationMinutes);
          } else {
            dayItems.push({
              startAt: new Date(currentTime),
              endAt: this.atHour(currentTime, DINNER_HOUR),
              type: 'free-time',
              title: 'Temps libre',
              description: 'Découverte personnelle, repos ou shopping',
              city: to.city,
            });
            currentTime = this.atHour(currentTime, DINNER_HOUR);
          }
        }

        // Dîner
        const restaurant = input.restaurants.find(
          (r) => r.mealType === 'dinner' && r.city === to.city,
        );
        dayItems.push({
          startAt: this.atHour(currentTime, DINNER_HOUR),
          endAt: this.atHour(currentTime, DINNER_HOUR + 2),
          type: 'meal',
          title: 'Dîner',
          description: restaurant ? `Chez ${restaurant.name}` : 'Dîner libre',
          city: to.city,
          refId: restaurant?.id,
        });

        // Fin de journée → push day
        pushDay();
        currentTime = this.atHour(this.addDays(currentTime, 1), BREAKFAST_HOUR);
        currentDayDate = this.toIsoDate(currentTime);

        // Petit-déj du lendemain
        dayItems.push({
          startAt: new Date(currentTime),
          endAt: this.addMinutes(currentTime, 60),
          type: 'meal',
          title: 'Petit-déjeuner',
          description: hotel ? `À ${hotel.name}` : "À l'hôtel",
          city: to.city,
          refId: hotel?.id,
        });
        currentTime = this.addMinutes(currentTime, 60);

        // Check-out si on repart le lendemain
        if (i + 1 < orderedStops.length - 1) {
          dayItems.push({
            startAt: new Date(currentTime),
            endAt: this.addMinutes(currentTime, 30),
            type: 'check-out',
            title: 'Check-out',
            description: 'Libération des chambres',
            city: to.city,
            refId: hotel?.id,
          });
          currentTime = this.addMinutes(currentTime, 30);
        }
      } else if (to.kindof === 'destination') {
        // Sur place : générer activités du jour
        const activitiesAtCity = input.activities.filter((a) => a.city === to.city);
        for (const act of activitiesAtCity) {
          dayItems.push({
            startAt: new Date(currentTime),
            endAt: this.addMinutes(currentTime, act.durationMinutes),
            type: 'activity',
            title: act.title,
            description: 'Activité programmée',
            city: to.city,
            refId: act.id,
          });
          currentTime = this.addMinutes(currentTime, act.durationMinutes);
        }
      }
    }

    if (dayItems.length) pushDay();

    return {
      travelId: input.travelId,
      totalDays: days.length,
      totalDistanceKm: Math.round(totalDistanceKm),
      totalTransitMinutes: Math.round(totalTransitMinutes),
      days,
      generatedAt: new Date(),
    };
  }

  private sortStopsByJourney(stops: Stop[]): Stop[] {
    const dep = stops.find((s) => s.kindof === 'departure');
    const dest = stops.find((s) => s.kindof === 'destination');
    const others = stops.filter((s) => s.kindof !== 'departure' && s.kindof !== 'destination');
    return [dep, ...others, dest].filter(Boolean) as Stop[];
  }

  private haversineKm(a: Stop, b: Stop): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
      Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
  }

  private formatDuration(min: number): string {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`;
  }

  private atHour(d: Date, hour: number): Date {
    const r = new Date(d);
    r.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0);
    return r;
  }

  private addMinutes(d: Date, minutes: number): Date {
    return new Date(d.getTime() + minutes * 60_000);
  }

  private addDays(d: Date, days: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
  }

  private toIsoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private summarize(items: ItineraryDayItem[]): string {
    const cities = Array.from(new Set(items.map((i) => i.city).filter(Boolean)));
    const activitiesCount = items.filter((i) => i.type === 'activity').length;
    if (activitiesCount === 0 && cities.length === 1) return `Journée libre à ${cities[0]}`;
    if (cities.length > 1) return `Trajet ${cities.join(' → ')}`;
    return `${activitiesCount} activité(s) à ${cities[0] ?? '—'}`;
  }
}
