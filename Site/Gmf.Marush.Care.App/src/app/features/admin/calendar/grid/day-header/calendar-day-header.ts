import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ScreenSize } from '@shared/services/screen-size';
import { CalendarNote } from '../../calendar-note';
import { DayInfo } from '../../day-info';
import { formatMoney } from '../../money-formatter';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'day-header', '[class.non-working-day]': 'isNonWorkingDay()' },
    selector: 'marush-calendar-day-header',
    imports: [],
    templateUrl: './calendar-day-header.html',
    styleUrls: ['../calendar-grid-header.scss', '../calendar-grid-day-actions.scss']
})
export class CalendarDayHeader {
    readonly day = input.required<DayInfo>();
    readonly dailyNote = input<CalendarNote | undefined>(undefined);
    readonly nonWorkingDay = input<CalendarNote | undefined>(undefined);

    readonly noteClick = output<string>();
    readonly nonWorkingDayToggle = output<CalendarNote | undefined>();

    private readonly screenSize = inject(ScreenSize);

    protected readonly isNonWorkingDay = computed(() => this.nonWorkingDay() !== undefined);
    protected readonly isWorkingDay = computed(() => !this.isNonWorkingDay());
    protected readonly hasNote = computed(() => this.dailyNote() !== undefined);
    protected readonly noteContent = computed(() => this.dailyNote()?.content ?? '');
    protected readonly displayName = computed(() => this.day().nameFor(this.screenSize.isDesktop()));
    protected readonly earnings = computed(() => `${formatMoney(this.day().dailyTotal)} RSD`);
    protected readonly earningsCaption = computed(() =>
        this.screenSize.isMobile() ? this.earnings() : `${this.day().earningsLabel}: ${this.earnings()}`);
}
