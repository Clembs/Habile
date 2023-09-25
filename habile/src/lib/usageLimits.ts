export const totalCredit =
  8 + // initial funding by me
  3.5 + // second funding by me
  3.5; // first batch of donations;

export const firstUserUsageWarning = 0.3;
export const secondUserUsageWarning = 0.5;
export const userUsageLimit = 0.7;
export const supporterUsageLimit = 1;

export const firstGlobalUsageWarning = totalCredit / 2;
export const secondGlobalUsageWarning = totalCredit / 1.5;
export const globalUsageLimit = totalCredit - 1;

export const averageUsageCost = 0.04;
