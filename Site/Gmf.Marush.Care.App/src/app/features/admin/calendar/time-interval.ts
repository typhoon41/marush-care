import { Signal, computed } from '@angular/core';
import { slotIndexToTime, slotsCount, timeToSlotIndex } from './calendar-time-slots';

const slotsInFourHours = 16;
const minimalRenderedSpan = 1;

const clampToGrid = (slotIndex: number): number => Math.min(Math.max(slotIndex, 0), slotsCount);

export class TimeInterval {
    readonly isComplete: Signal<boolean> = computed(() => !!this.startTime && !!this.endTime);
    readonly startSlot: Signal<number> = computed(() => clampToGrid(timeToSlotIndex(this.startTime)));
    readonly endSlot: Signal<number> = computed(() => clampToGrid(timeToSlotIndex(this.endTime)));
    readonly slotSpan: Signal<number> = computed(() => this.endSlot() - this.startSlot());
    readonly renderedSpan: Signal<number> = computed(() => Math.max(this.slotSpan(), minimalRenderedSpan));
    readonly hasOrderViolation: Signal<boolean> = computed(() => this.isComplete() && this.slotSpan() <= 0);
    readonly hasDurationViolation: Signal<boolean> = computed(() => this.isComplete() && this.slotSpan() > slotsInFourHours);

    constructor(readonly startTime: string, readonly endTime: string) { }

    static fromSlots = (startSlot: number, endSlotExclusive: number): TimeInterval =>
        new TimeInterval(slotIndexToTime(startSlot), slotIndexToTime(endSlotExclusive));

    equals(other: TimeInterval): boolean {
        return this.startTime === other.startTime && this.endTime === other.endTime;
    }
}
