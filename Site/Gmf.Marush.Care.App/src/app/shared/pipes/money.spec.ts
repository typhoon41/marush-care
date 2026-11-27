/* eslint-disable @typescript-eslint/no-magic-numbers -- Characterization specs pin literal legacy values. */
import { Money } from './money';

describe('Money pipe', () => {
    const money = new Money();

    it('RULE-015 inserts "." every three digits from the right', () => {
        expect(money.transform(12500)).toBe('12.500');
        expect(money.transform(3500)).toBe('3.500');
        expect(money.transform(1234567)).toBe('1.234.567');
        expect(money.transform(999)).toBe('999');
        expect(money.transform('12500')).toBe('12.500');
    });

    it('RULE-015 shows an empty string for 0 and for an empty value', () => {
        expect(money.transform(0)).toBe('');
        expect(money.transform('')).toBe('');
    });

    it('RULE-015 groups only the integer part before a decimal point and keeps a minus sign', () => {
        expect(money.transform(1234.5)).toBe('1.234.5');
        expect(money.transform(-12500)).toBe('-12.500');
        expect(money.transform('3.500 - 4.000')).toBe('3.500 - 4.000');
    });
});
