export const formatMoney = (amount: number): string =>
    amount.toLocaleString('sr-RS', { maximumFractionDigits: 0 });
