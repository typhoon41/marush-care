import { CalendarEntry } from './calendar-entry';
import { CalendarNote } from './calendar-note';
import { PublicAppointment } from './public-appointment';

export class CalendarWeek {
    weekStart: string = '';
    entries: CalendarEntry[] = [];
    publicAppointments: PublicAppointment[] = [];
    notes: CalendarNote[] = [];
}
