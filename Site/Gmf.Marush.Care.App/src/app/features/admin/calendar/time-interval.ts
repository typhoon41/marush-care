import { Signal, computed } from '@angular/core';
import { slotIndexToTime, timeToSlotIndex } from './calendar-time-slots';

const slotsInFourHours = 16;

export class TimeInterval {
    readonly isComplete: Signal<boolean> = computed(() => !!this.startTime && !!this.endTime);
    readonly startSlot: Signal<number> = computed(() => timeToSlotIndex(this.startTime));
    readonly endSlot: Signal<number> = computed(() => timeToSlotIndex(this.endTime));
    readonly slotSpan: Signal<number> = computed(() => this.endSlot() - this.startSlot());
    readonly hasOrderViolation: Signal<boolean> = computed(() => this.isComplete() && this.slotSpan() <= 0);
    readonly hasDurationViolation: Signal<boolean> = computed(() => this.isComplete() && this.slotSpan() > slotsInFourHours);

    constructor(readonly startTime: string, readonly endTime: string) { }

    static fromSlots = (startSlot: number, endSlotExclusive: number): TimeInterval =>
        new TimeInterval(slotIndexToTime(startSlot), slotIndexToTime(endSlotExclusive));

    equals(other: TimeInterval): boolean {
        return this.startTime === other.startTime && this.endTime === other.endTime;
    }
}
