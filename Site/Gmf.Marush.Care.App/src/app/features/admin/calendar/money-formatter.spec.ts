/* eslint-disable @typescript-eslint/no-magic-numbers -- Characterization specs pin literal legacy values. */
import { formatMoney } from './money-formatter';

describe('formatMoney', () => {
    it('RULE-015 groups thousands with "." in sr-RS and shows no decimals', () => {
        expect(formatMoney(12500)).toBe('12.500');
        expect(formatMoney(1500)).toBe('1.500');
        expect(formatMoney(999)).toBe('999');
    });

    it('RULE-015 rounds fractions to whole dinars and shows 0 and negatives', () => {
        expect(formatMoney(1234567.6)).toBe('1.234.568');
        expect(formatMoney(0)).toBe('0');
        expect(formatMoney(-1500)).toBe('-1.500');
    });
});
