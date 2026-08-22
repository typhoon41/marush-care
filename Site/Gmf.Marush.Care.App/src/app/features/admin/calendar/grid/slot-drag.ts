import { computed, signal } from '@angular/core';
import { CalendarSelection } from '../calendar-selection';
import { TimeInterval } from '../time-interval';

const unsetSlot = -1;

/** Pointer drag across the slot cells of a single day column. */
export class SlotDrag {
    private readonly anchorDate = signal<string | null>(null);
    private readonly anchorSlot = signal(unsetSlot);
    private readonly currentSlot = signal(unsetSlot);

    readonly isActive = computed(() => this.anchorDate() !== null);

    private readonly range = computed(() => {
        const date = this.anchorDate();
        const anchor = this.anchorSlot();
        const current = this.currentSlot();
        if (!date || anchor < 0 || current < 0) {
            return null;
        }

        return { date, minimumSlot: Math.min(anchor, current), maximumSlot: Math.max(anchor, current) };
    });

    readonly start = (date: string, slot: number) => {
        this.anchorDate.set(date);
        this.anchorSlot.set(slot);
        this.currentSlot.set(slot);
    };

    readonly moveTo = (slot: number) => this.currentSlot.set(slot);

    readonly cancel = () => {
        this.anchorDate.set(null);
        this.anchorSlot.set(unsetSlot);
        this.currentSlot.set(unsetSlot);
    };

    readonly complete = (): CalendarSelection | null => {
        const range = this.range();
        if (!range) {
            return null;
        }

        const selection = {
            date: range.date,
            interval: TimeInterval.fromSlots(range.minimumSlot, range.maximumSlot + 1)
        };
        this.cancel();
        return selection;
    };

    readonly selectedSlotsOn = (date: string): number[] => {
        const range = this.range();
        if (range?.date !== date) {
            return [];
        }

        const length = range.maximumSlot - range.minimumSlot + 1;
        return Array.from({ length }, (_, offset) => range.minimumSlot + offset);
    };

    anchorSlotOn(date: string): number {
        if (this.anchorDate() !== date) {
            return unsetSlot;
        }

        return this.anchorSlot();
    }
}
