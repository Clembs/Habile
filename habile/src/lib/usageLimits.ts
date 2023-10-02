export const totalCredit =
  8 + // initial funding by me
  3.5 + // second funding by me
  3.5; // first batch of donations;

export const firstUserUsageWarning = 0.35;
export const secondUserUsageWarning = 0.6;
export const userUsageLimit = 0.8;
export const supporterUsageLimit = 1.3;

export const firstGlobalUsageWarning = totalCredit / 1.5;
export const secondGlobalUsageWarning = totalCredit * 0.75;
export const globalUsageLimit = totalCredit - 1;

export const averageUsageCost = 0.04;
