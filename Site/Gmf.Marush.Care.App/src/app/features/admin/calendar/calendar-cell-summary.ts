import { Signal, computed } from '@angular/core';
import { CalendarEntry } from './calendar-entry';
import { formatMoney } from './money-formatter';
import { PublicAppointment } from './public-appointment';
import { TimeInterval } from './time-interval';

type BookedPeriod = Pick<CalendarEntry, 'startTime' | 'endTime' | 'clientName' | 'treatmentTitles' | 'money'>;

/** What a grid cell shows for a booked period, whether an admin entry or an online request. */
export class CalendarCellSummary {
    static readonly ofEntry = (entry: CalendarEntry): CalendarCellSummary =>
        new CalendarCellSummary(entry, entry.notes ?? '');

    static readonly ofRequest = (request: PublicAppointment): CalendarCellSummary =>
        new CalendarCellSummary(request, request.description ?? '');

    private readonly interval: TimeInterval;

    readonly timeRange: Signal<string> = computed(() => this.interval.range());
    readonly positionClasses: Signal<string> = computed(() => `grid-entry-placeholder ${this.interval.positionClasses()}`);
    readonly clientName: Signal<string> = computed(() => this.booked.clientName);
    readonly hasClientName: Signal<boolean> = computed(() => this.clientName().length > 0);
    readonly treatmentTitles: Signal<string[]> = computed(() => this.booked.treatmentTitles);
    readonly tooltip: Signal<string> = computed(() => [this.clientName(), ...this.treatmentTitles()].join('\n'));
    readonly hasMoney: Signal<boolean> = computed(() => this.booked.money !== undefined && this.booked.money !== null);
    readonly money: Signal<string> = computed(() => `${formatMoney(this.booked.money ?? 0)} RSD`);
    readonly hasNotes: Signal<boolean> = computed(() => this.notes.length > 0);

    private constructor(private readonly booked: BookedPeriod, readonly notes: string) {
        this.interval = TimeInterval.of(booked);
    }
}
