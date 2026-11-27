/* eslint-disable @typescript-eslint/no-magic-numbers, max-lines-per-function -- Characterization specs pin literal legacy values in one describe per unit. */
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NonNullableFormBuilder } from '@angular/forms';
import { buildEntryForm } from './entry-form';
import { MoneySynchronization } from './money-synchronization';

const synchronizedWith = (initialTotal: number) => {
    const total = signal(initialTotal);
    const form = buildEntryForm(TestBed.inject(NonNullableFormBuilder));
    const synchronization = TestBed.runInInjectionContext(() => new MoneySynchronization(total, form));
    TestBed.tick();
    return { total, money: form.controls.money, synchronization };
};

const typeMoney = (money: ReturnType<typeof synchronizedWith>['money'], value: number | null) => {
    money.setValue(value);
    money.markAsDirty();
};

describe('MoneySynchronization', () => {
    it('RULE-009 fills money with the treatment total and keeps following it while untouched', () => {
        const { total, money } = synchronizedWith(6000);
        expect(money.value).toBe(6000);

        total.set(12500);
        TestBed.tick();

        expect(money.value).toBe(12500);
        expect(money.pristine).toBe(true);
    });

    it('RULE-009 leaves money empty for a total of 0', () => {
        const { total, money } = synchronizedWith(0);
        expect(money.value).toBeNull();

        total.set(6500);
        TestBed.tick();
        total.set(0);
        TestBed.tick();

        expect(money.value).toBeNull();
    });

    it('RULE-009 stops following once the admin types an amount', () => {
        const { total, money } = synchronizedWith(12500);
        typeMoney(money, 11000);

        total.set(18500);
        TestBed.tick();

        expect(money.value).toBe(11000);
    });

    it('RULE-009 resumes following after the admin clears the field, on the next total change', () => {
        const { total, money } = synchronizedWith(12500);
        typeMoney(money, 11000);
        total.set(18500);
        TestBed.tick();

        typeMoney(money, null);
        TestBed.tick();
        expect(money.value).toBeNull();

        total.set(20000);
        TestBed.tick();
        expect(money.value).toBe(20000);
        expect(money.pristine).toBe(true);
    });

    it('RULE-009 keeps an existing entry amount that differs from the total', () => {
        const { total, money, synchronization } = synchronizedWith(12500);
        synchronization.reset(9000);
        TestBed.tick();
        money.setValue(9000);

        total.set(18500);
        TestBed.tick();

        expect(money.value).toBe(9000);
    });

    it('RULE-009 follows the total for an entry whose amount equals it or is missing', () => {
        const { total, money, synchronization } = synchronizedWith(12500);
        synchronization.reset(12500);
        total.set(18500);
        TestBed.tick();
        expect(money.value).toBe(18500);

        synchronization.reset();
        total.set(6000);
        TestBed.tick();
        expect(money.value).toBe(6000);
    });
});
