export const IMPRESSION_VALUE = 10;
export const CLICK_VALUE = 30;

export function calculateRevenueSummary(input: {
  impressionCount: number;
  clickCount: number;
  publisherPercent: number;
  adstreamPercent: number;
}) {
  const grossRevenue =
    input.impressionCount * IMPRESSION_VALUE + input.clickCount * CLICK_VALUE;
  const publisherRevenue = Math.round(grossRevenue * (input.publisherPercent / 100));
  const adstreamRevenue = Math.round(grossRevenue * (input.adstreamPercent / 100));
  const ctr = input.impressionCount === 0 ? 0 : input.clickCount / input.impressionCount;

  return {
    impressionCount: input.impressionCount,
    clickCount: input.clickCount,
    ctr,
    grossRevenue,
    publisherRevenue,
    adstreamRevenue
  };
}
