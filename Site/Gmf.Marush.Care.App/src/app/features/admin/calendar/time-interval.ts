import { Signal, computed } from '@angular/core';
import { CalendarTimeSlots } from './calendar-time-slots';

const slotsInFourHours = 16;
const minimalRenderedSpan = 1;

export class TimeInterval {
    readonly isComplete: Signal<boolean> = computed(() => !!this.startTime && !!this.endTime);
    readonly startSlot: Signal<number> = computed(() =>
        CalendarTimeSlots.clampToGrid(CalendarTimeSlots.toSlotIndex(this.startTime)));

    readonly endSlot: Signal<number> = computed(() =>
        CalendarTimeSlots.clampToGrid(CalendarTimeSlots.toSlotIndex(this.endTime)));

    readonly slotSpan: Signal<number> = computed(() => this.endSlot() - this.startSlot());
    readonly renderedSpan: Signal<number> = computed(() => Math.max(this.slotSpan(), minimalRenderedSpan));
    readonly positionClasses: Signal<string> = computed(() =>
        `entry-top-${this.startSlot()} entry-span-${this.renderedSpan()}`);

    readonly hasOrderViolation: Signal<boolean> = computed(() => this.isComplete() && this.slotSpan() <= 0);
    readonly hasDurationViolation: Signal<boolean> = computed(() => this.isComplete() && this.slotSpan() > slotsInFourHours);

    constructor(readonly startTime: string, readonly endTime: string) { }

    static fromSlots = (startSlot: number, endSlotExclusive: number): TimeInterval =>
        new TimeInterval(CalendarTimeSlots.toTime(startSlot), CalendarTimeSlots.toTime(endSlotExclusive));

    equals(other: TimeInterval): boolean {
        return this.startTime === other.startTime && this.endTime === other.endTime;
    }
}
