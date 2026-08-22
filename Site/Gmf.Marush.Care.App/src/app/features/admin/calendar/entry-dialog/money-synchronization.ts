import { Signal, effect, signal } from '@angular/core';
import { EntryForm } from './calendar-entry-form';

export class MoneySynchronization {
    private readonly enabled = signal(true);

    constructor(private readonly priceTotal: Signal<number>, form: EntryForm) {
        effect(() => {
            const total = this.priceTotal();
            const money = form.controls.money;
            if (money.dirty) {
                this.enabled.set(money.value === null);
            }
            if (!this.enabled()) {
                return;
            }
            money.setValue(total > 0 ? total : null);
            money.markAsPristine();
        });
    }

    readonly reset = (entryMoney?: number) => {
        this.enabled.set(entryMoney === undefined || entryMoney === this.priceTotal());
    };
}
