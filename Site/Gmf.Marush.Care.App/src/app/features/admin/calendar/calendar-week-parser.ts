import { CalendarDate } from './calendar-date';
import { CalendarEntry } from './calendar-entry';
import { CalendarNote } from './calendar-note';
import { CalendarWeek } from './calendar-week';
import { PublicAppointment } from './public-appointment';
import { TreatmentCatalog } from './treatment-catalog-search';

const displayTimeLength = 'HH:mm'.length;

const toDisplayTime = (time: string): string => time.substring(0, displayTimeLength);

const toIsoDate = (serbian: string): string => CalendarDate.fromSerbian(serbian).iso;

/** Turns the Serbian-formatted week payload from the API into the models the page renders. */
export class CalendarWeekParser {
    static parse = (raw: unknown): CalendarWeek => {
        const week = raw as CalendarWeek;
        return Object.assign(new CalendarWeek(), week, {
            weekStart: toIsoDate(week.weekStart),
            entries: week.entries.map(CalendarWeekParser.parseEntry),
            publicAppointments: week.publicAppointments.map(CalendarWeekParser.parseAppointment),
            notes: week.notes.map(CalendarWeekParser.parseNote)
        });
    };

    static parseEntry = (entry: CalendarEntry): CalendarEntry => Object.assign(new CalendarEntry(), entry, {
            date: toIsoDate(entry.date),
            startTime: toDisplayTime(entry.startTime),
            endTime: toDisplayTime(entry.endTime),
            treatmentTitles: entry.treatments.map(TreatmentCatalog.titleOf)
        });

    static parseAppointment = (appointment: PublicAppointment): PublicAppointment => Object.assign(new PublicAppointment(), appointment, {
            date: toIsoDate(appointment.date),
            startTime: toDisplayTime(appointment.startTime),
            endTime: toDisplayTime(appointment.endTime)
        });

    static parseNote = (note: CalendarNote): CalendarNote => Object.assign(new CalendarNote(), note, { date: toIsoDate(note.date) });
}
