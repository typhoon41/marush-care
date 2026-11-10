const length = 2;

/** The zero-padded form ISO dates and clock times share: 7 becomes 07. */
export class TwoDigits {
    static readonly of = (value: number): string => value.toString().padStart(length, '0');
}
