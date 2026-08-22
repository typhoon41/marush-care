import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Calendar } from './calendar';
import { CalendarDate } from './calendar-date';
import { CalendarEntry } from './calendar-entry';
import { CalendarNote } from './calendar-note';
import { CalendarNoteType } from './calendar-note-type';
import { CalendarSelection } from './calendar-selection';
import { DayInfo } from './day-info';
import { CalendarEntryDialog } from './entry-dialog/calendar-entry-dialog';
import { CalendarGrid } from './grid/calendar-grid';
import { formatMoney } from './money-formatter';
import { CalendarNotesDialog } from './notes-dialog/calendar-notes-dialog';
import { WorkingWeek } from './working-week';

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

    protected readonly week = signal(WorkingWeek.containing(new Date()));
    protected readonly weekStart = computed(() => this.week().start.iso);
    protected readonly weekLabel = computed(() => this.week().label);
    protected readonly weekData = this.calendarService.getWeek(this.weekStart);

    protected readonly entries = computed(() => this.weekData.value()?.entries ?? []);
    protected readonly publicAppointments = computed(() => this.weekData.value()?.publicAppointments ?? []);
    protected readonly notes = computed(() => this.weekData.value()?.notes ?? []);

    protected readonly days = computed((): DayInfo[] => {
        const entries = this.entries();
        return this.week().days.map(day => new DayInfo(day, entries));
    });

    protected readonly weeklyTotal = computed(() =>
        this.days().reduce((total, day) => total + day.dailyTotal, 0)
    );

    protected readonly hasWeeklyTotal = computed(() => this.weeklyTotal() > 0);

    protected readonly weeklyNote = computed(() =>
        this.notes().find(note => note.noteType === 'Weekly')
    );

    protected readonly hasWeeklyNote = computed(() => this.weeklyNote() !== undefined);
    protected readonly hasNoWeeklyNote = computed(() => !this.hasWeeklyNote());
    protected readonly weeklyNoteContent = computed(() => this.weeklyNote()?.content ?? '');

    protected readonly formatMoney = formatMoney;

    constructor(title: Title) {
        title.setTitle('Marush: Space of Care - kalendar');
    }

    protected readonly goToPreviousWeek = () => this.week.update(week => week.previous());
    protected readonly goToNextWeek = () => this.week.update(week => week.next());
    protected readonly goToThisWeek = () => this.week.set(WorkingWeek.containing(new Date()));

    protected readonly onEntryClick = (entry: CalendarEntry) => {
        this.entryDialog().open(undefined, entry);
    };

    protected readonly onDragComplete = (selection: CalendarSelection) => {
        this.entryDialog().open(selection);
    };

    protected readonly onNoteClick = (event: { date: string; type: CalendarNoteType }) => {
        const existing = this.notes().find(note => note.date === event.date && note.noteType === event.type);
        this.notesDialog().open(event.date, event.type, existing);
    };

    protected readonly onWeeklyNoteClick = () => {
        this.notesDialog().open(this.weekStart(), 'Weekly', this.weeklyNote());
    };

    protected readonly onNonWorkingDayToggle = async(event: { date: string; existing: CalendarNote | undefined }) => {
        if (event.existing) {
            await this.calendarService.deleteNote(event.existing.id);
        } else {
            await this.calendarService.upsertNote({
                date: CalendarDate.fromIso(event.date).serbian,
                noteType: 'NonWorkingDay',
                content: ''
            });
        }
        this.weekData.reload();
    };

    protected readonly onSaved = () => {
        this.weekData.reload();
    };
}
