import { Injectable } from '@nestjs/common';

export interface PricingInput {
  passengersCount: number;
  busQuoteEur: number;
  hotelNightEur: number;
  nightsCount: number;
  roomsCount: number;
  mealEur: number;
  mealsCount: number;
  activityEur: number;
  activitiesCount: number;
  insurancePerPaxEur?: number;
  marginRatePercent?: number;
  stripeFeePercent?: number;
  stripeFeeFixedEur?: number;
}

export interface PricingBreakdown {
  passengersCount: number;
  components: {
    bus: number;
    hotel: number;
    meals: number;
    activities: number;
    insurance: number;
  };
  totalCostEur: number;
  marginPercent: number;
  marginGrossEur: number;
  priceTtcEur: number;
  pricePerPaxEur: number;
  priceRoundedEur: number;
  vatOnMarginEur: number;
  marginAfterVatEur: number;
  stripeFeesEur: number;
  marginNetEur: number;
  eventyShareEur: number;
  creatorShareEur: number;
  ratio: { eventy: 0.82; creator: 0.18 };
}

const DEFAULT_INSURANCE_PER_PAX = 9;
const DEFAULT_MARGIN_PERCENT = 25;
const DEFAULT_STRIPE_FEE_PERCENT = 1.4;
const DEFAULT_STRIPE_FEE_FIXED = 0.25;
const ROUND_TO_EUR = 5;

@Injectable()
export class PricingEngineService {
  compute(input: PricingInput): PricingBreakdown {
    const insurancePerPax = input.insurancePerPaxEur ?? DEFAULT_INSURANCE_PER_PAX;
    const marginPercent = input.marginRatePercent ?? DEFAULT_MARGIN_PERCENT;
    const stripeFeePercent = input.stripeFeePercent ?? DEFAULT_STRIPE_FEE_PERCENT;
    const stripeFeeFixed = input.stripeFeeFixedEur ?? DEFAULT_STRIPE_FEE_FIXED;

    const bus = input.busQuoteEur;
    const hotel = input.hotelNightEur * input.nightsCount * input.roomsCount;
    const meals = input.mealEur * input.mealsCount * input.passengersCount;
    const activities = input.activityEur * input.activitiesCount * input.passengersCount;
    const insurance = insurancePerPax * input.passengersCount;

    const totalCostEur = bus + hotel + meals + activities + insurance;
    const marginGrossEur = totalCostEur * (marginPercent / 100);
    const priceTtcRaw = totalCostEur + marginGrossEur;

    const pricePerPaxRaw = priceTtcRaw / input.passengersCount;
    const pricePerPaxRounded = this.roundUpTo(pricePerPaxRaw, ROUND_TO_EUR);
    const priceRoundedEur = pricePerPaxRounded * input.passengersCount;

    const realMargin = priceRoundedEur - totalCostEur;
    const vatOnMarginEur = +(realMargin * (20 / 120)).toFixed(2);
    const marginAfterVatEur = +(realMargin - vatOnMarginEur).toFixed(2);

    const stripeFeesEur = +(
      (priceRoundedEur * stripeFeePercent) / 100 +
      stripeFeeFixed * input.passengersCount
    ).toFixed(2);

    const marginNetEur = +(marginAfterVatEur - stripeFeesEur).toFixed(2);

    // 82% Eventy / 18% créateur — appliqué SUR LA MARGE uniquement
    const eventyShareEur = +(marginNetEur * 0.82).toFixed(2);
    const creatorShareEur = +(marginNetEur * 0.18).toFixed(2);

    return {
      passengersCount: input.passengersCount,
      components: {
        bus: +bus.toFixed(2),
        hotel: +hotel.toFixed(2),
        meals: +meals.toFixed(2),
        activities: +activities.toFixed(2),
        insurance: +insurance.toFixed(2),
      },
      totalCostEur: +totalCostEur.toFixed(2),
      marginPercent,
      marginGrossEur: +marginGrossEur.toFixed(2),
      priceTtcEur: +priceTtcRaw.toFixed(2),
      pricePerPaxEur: +pricePerPaxRounded.toFixed(2),
      priceRoundedEur: +priceRoundedEur.toFixed(2),
      vatOnMarginEur,
      marginAfterVatEur,
      stripeFeesEur,
      marginNetEur,
      eventyShareEur,
      creatorShareEur,
      ratio: { eventy: 0.82, creator: 0.18 },
    };
  }

  private roundUpTo(value: number, multiple: number): number {
    return Math.ceil(value / multiple) * multiple;
  }
}
