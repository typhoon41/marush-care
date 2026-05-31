import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Calendar } from './calendar';
import { CalendarEntry } from './calendar-entry';
import { CalendarNote } from './calendar-note';
import { CalendarNoteType } from './calendar-note-type';
import { addDays, daysInWeek, mondayOf, toSerbianDate, workingDaysInWeek } from './calendar-week-navigator';
import { DayInfo } from './day-info';
import { CalendarEntryDialog } from './entry-dialog/calendar-entry-dialog';
import { CalendarGrid } from './grid/calendar-grid';
import { formatMoney } from './money-formatter';
import { CalendarNotesDialog } from './notes-dialog/calendar-notes-dialog';

const weekLastDayOffset = workingDaysInWeek - 1;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-calendar-page',
    imports: [CalendarGrid, CalendarEntryDialog, CalendarNotesDialog],
    templateUrl: './calendar-page.html',
    styleUrl: './calendar-page.scss',
    host: { class: 'calendar-page' }
})
export class CalendarPage {
    private readonly calendarService = inject(Calendar);
    private readonly entryDialog = viewChild.required(CalendarEntryDialog);
    private readonly notesDialog = viewChild.required(CalendarNotesDialog);

    protected readonly weekStart = signal(mondayOf(new Date()));
    protected readonly weekData = this.calendarService.getWeek(this.weekStart);

    protected readonly entries = computed(() => this.weekData.value()?.entries ?? []);
    protected readonly publicAppointments = computed(() => this.weekData.value()?.publicAppointments ?? []);
    protected readonly notes = computed(() => this.weekData.value()?.notes ?? []);

    protected readonly days = computed((): DayInfo[] => {
        const start = this.weekStart();
        const entries = this.entries();
        return Array.from({ length: workingDaysInWeek }, (_, dayIndex) =>
            new DayInfo(addDays(start, dayIndex), entries));
    });

    protected readonly weeklyTotal = computed(() =>
        this.days().reduce((sum, day) => sum + day.dailyTotal, 0)
    );

    protected readonly weeklyNote = computed(() =>
        this.notes().find(note => note.noteType === 'Weekly')
    );

    protected readonly weekLabel = computed(() => {
        const start = this.weekStart();
        const end = addDays(start, weekLastDayOffset);
        const formatDate = (iso: string) =>
            new Date(`${iso}T12:00:00`).toLocaleDateString('sr-Latn-RS', { day: 'numeric', month: 'short' });
        return `${formatDate(start)} – ${formatDate(end)}`;
    });

    protected readonly formatMoney = formatMoney;

    constructor(title: Title) {
        title.setTitle('Kalendar');
    }

    protected readonly goToPrevWeek = () => this.weekStart.set(addDays(this.weekStart(), -daysInWeek));
    protected readonly goToNextWeek = () => this.weekStart.set(addDays(this.weekStart(), daysInWeek));
    protected readonly goToThisWeek = () => this.weekStart.set(mondayOf(new Date()));

    protected readonly onEntryClick = (entry: CalendarEntry) => {
        this.entryDialog().open(undefined, undefined, undefined, entry);
    };

    protected readonly onDragComplete = (drag: { date: string; startTime: string; endTime: string }) => {
        this.entryDialog().open(drag.date, drag.startTime, drag.endTime);
    };

    protected readonly onNoteClick = (event: { date: string; type: CalendarNoteType }) => {
        const existing = this.notes().find(note => note.date === toSerbianDate(event.date) && note.noteType === event.type);
        this.notesDialog().open(event.date, event.type, existing);
    };

    protected readonly onWeeklyNoteClick = () => {
        const existing = this.weeklyNote();
        this.notesDialog().open(this.weekStart(), 'Weekly', existing);
    };

    protected readonly onNonWorkingDayToggle = async (event: { date: string; existing: CalendarNote | undefined }) => {
        if (event.existing) {
            await this.calendarService.deleteNote(event.existing.id);
        } else {
            await this.calendarService.upsertNote({ date: toSerbianDate(event.date), noteType: 'NonWorkingDay', content: '' });
        }
        this.weekData.reload();
    };

    protected readonly onSaved = () => {
        this.weekData.reload();
    };
}
