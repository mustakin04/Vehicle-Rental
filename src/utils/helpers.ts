export const calculateTotalPrice = (dailyPrice: number, startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) throw new Error("rent_end_date must be after rent_start_date");
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive days
  return Number((diffDays * dailyPrice).toFixed(2));
};
