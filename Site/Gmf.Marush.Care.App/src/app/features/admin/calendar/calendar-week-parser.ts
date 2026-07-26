import { CalendarEntry } from './calendar-entry';
import { CalendarNote } from './calendar-note';
import { CalendarWeek } from './calendar-week';
import { fromSerbianDate } from './calendar-week-navigator';
import { PublicAppointment } from './public-appointment';
import { treatmentTitle } from './treatment-catalog-search';

const displayTimeLength = 'HH:mm'.length;

const toDisplayTime = (time: string): string => time.substring(0, displayTimeLength);

const parseEntry = (entry: CalendarEntry): CalendarEntry => Object.assign(new CalendarEntry(), entry, {
    date: fromSerbianDate(entry.date),
    startTime: toDisplayTime(entry.startTime),
    endTime: toDisplayTime(entry.endTime),
    treatmentTitles: entry.treatments.map(treatmentTitle)
});

const parseAppointment = (appointment: PublicAppointment): PublicAppointment =>
    Object.assign(new PublicAppointment(), appointment, {
        date: fromSerbianDate(appointment.date),
        startTime: toDisplayTime(appointment.startTime),
        endTime: toDisplayTime(appointment.endTime)
    });

const parseNote = (note: CalendarNote): CalendarNote => Object.assign(new CalendarNote(), note, {
    date: fromSerbianDate(note.date)
});

export const parseCalendarWeek = (raw: unknown): CalendarWeek => {
    const week = raw as CalendarWeek;
    return Object.assign(new CalendarWeek(), week, {
        weekStart: fromSerbianDate(week.weekStart),
        entries: week.entries.map(parseEntry),
        publicAppointments: week.publicAppointments.map(parseAppointment),
        notes: week.notes.map(parseNote)
    });
};
