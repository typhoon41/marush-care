import { CalendarDate } from './calendar-date';
import { CalendarEntry } from './calendar-entry';
import { CalendarNote } from './calendar-note';
import { CalendarWeek } from './calendar-week';
import { PublicAppointment } from './public-appointment';
import { TreatmentCatalog } from './treatment-catalog-search';

const displayTimeLength = 'HH:mm'.length;

/** Turns the Serbian-formatted week payload from the API into the models the page renders. */
export class CalendarWeekParser {
    static readonly parse = (raw: unknown): CalendarWeek => {
        const week = raw as CalendarWeek;
        return Object.assign(new CalendarWeek(), week, {
            weekStart: CalendarWeekParser.toIsoDate(week.weekStart),
            entries: week.entries.map(CalendarWeekParser.parseEntry),
            publicAppointments: week.publicAppointments.map(CalendarWeekParser.parseAppointment),
            notes: week.notes.map(CalendarWeekParser.parseNote)
        });
    };

    static readonly parseEntry = (entry: CalendarEntry): CalendarEntry =>
        Object.assign(new CalendarEntry(), entry, CalendarWeekParser.scheduleOf(entry), {
            treatmentTitles: entry.treatments.map(TreatmentCatalog.titleOf)
        });

    static readonly parseAppointment = (appointment: PublicAppointment): PublicAppointment =>
        Object.assign(new PublicAppointment(), appointment, CalendarWeekParser.scheduleOf(appointment));

    static readonly parseNote = (note: CalendarNote): CalendarNote =>
        Object.assign(new CalendarNote(), note, { date: CalendarWeekParser.toIsoDate(note.date) });

    private static readonly scheduleOf = (scheduled: { date: string; startTime: string; endTime: string }) => ({
        date: CalendarWeekParser.toIsoDate(scheduled.date),
        startTime: CalendarWeekParser.toDisplayTime(scheduled.startTime),
        endTime: CalendarWeekParser.toDisplayTime(scheduled.endTime)
    });

    private static readonly toIsoDate = (serbian: string): string => CalendarDate.fromSerbian(serbian).iso;

    private static readonly toDisplayTime = (time: string): string => time.substring(0, displayTimeLength);
}
