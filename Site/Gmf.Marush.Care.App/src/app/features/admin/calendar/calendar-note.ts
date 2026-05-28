import { CalendarNoteType } from './calendar-note-type';

export class CalendarNote {
    id: string = '';
    date: string = '';
    noteType: CalendarNoteType = 'Daily';
    content: string = '';
}
