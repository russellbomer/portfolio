type StripeProduct = { id: string; name: string };
export type StripePrice = {
  id: string;
  unitAmount: number;
  interval: string;
  trialPeriodDays: number;
  productId: string;
};

export async function getStripeProducts(): Promise<StripeProduct[]> {
  // Legacy stub data
  return [
    { id: "prod_base", name: "Base" },
    { id: "prod_plus", name: "Plus" },
  ];
}

export async function getStripePrices(): Promise<StripePrice[]> {
  return [
    {
      id: "price_base_month",
      unitAmount: 800,
      interval: "month",
      trialPeriodDays: 7,
      productId: "prod_base",
    },
    {
      id: "price_plus_month",
      unitAmount: 1200,
      interval: "month",
      trialPeriodDays: 7,
      productId: "prod_plus",
    },
  ];
}

// Legacy placeholder Stripe client
export const stripe = {} as any;
