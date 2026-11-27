import { FormControl } from '@angular/forms';
import { phonePattern } from './request';

const accepts = (phone: string) => new FormControl(phone, phonePattern).valid;

describe('Booking phone pattern', () => {
    it('RULE-021 accepts 06 followed by 7 or 8 digits', () => {
        expect(accepts('064123456')).toBe(true);
        expect(accepts('0641234567')).toBe(true);
    });

    it('RULE-021 rejects 06 with 6 or 9 digits and numbers not starting with 06', () => {
        expect(accepts('06412345')).toBe(false);
        expect(accepts('06412345678')).toBe(false);
        expect(accepts('0123')).toBe(false);
        expect(accepts('0111234567')).toBe(false);
    });

    it('RULE-021 accepts + followed by 10 to 13 digits', () => {
        expect(accepts('+1234567890')).toBe(true);
        expect(accepts('+381641234567')).toBe(true);
        expect(accepts('+1234567890123')).toBe(true);
    });

    it('RULE-021 rejects + with 9 or 14 digits', () => {
        expect(accepts('+123456789')).toBe(false);
        expect(accepts('+12345678901234')).toBe(false);
    });

    it('RULE-021 is anchored at both ends, so trailing or leading text is rejected', () => {
        expect(accepts('0641234567abc')).toBe(false);
        expect(accepts('abc+38164123456')).toBe(false);
        expect(accepts('064 123 4567')).toBe(false);
        expect(accepts('+381 64 1234567')).toBe(false);
    });

    it('RULE-021 leaves an empty phone to the required validator', () => {
        expect(accepts('')).toBe(true);
    });
});
