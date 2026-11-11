import { computed, signal } from '@angular/core';
import { CalendarSelection } from '../calendar-selection';
import { CalendarTimeSlots } from '../calendar-time-slots';
import { TimeInterval } from '../time-interval';

/** Pointer drag across the slot cells of a single day column. */
export class SlotDrag {
    private readonly anchorDate = signal<string | null>(null);
    private readonly anchorSlot = signal(CalendarTimeSlots.unset);
    private readonly currentSlot = signal(CalendarTimeSlots.unset);

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

    /** A slot of another day column is ignored, so the selection stays at the last slot reached in the anchor day. */
    readonly moveTo = (date: string, slot: number) => {
        if (date !== this.anchorDate()) {
            return;
        }

        this.currentSlot.set(slot);
    };

    readonly cancel = () => {
        this.anchorDate.set(null);
        this.anchorSlot.set(CalendarTimeSlots.unset);
        this.currentSlot.set(CalendarTimeSlots.unset);
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

    readonly anchorSlotOn = (date: string): number => {
        if (this.anchorDate() !== date) {
            return CalendarTimeSlots.unset;
        }

        return this.anchorSlot();
    };
}
