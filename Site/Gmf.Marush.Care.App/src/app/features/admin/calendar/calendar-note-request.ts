import { CalendarNoteType } from './calendar-note-type';

export class CalendarNoteRequest {
    date: string = '';
    noteType: CalendarNoteType = 'Daily';
    content: string = '';
}
