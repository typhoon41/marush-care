import { CalendarNoteType } from './calendar-note-type';

export interface CalendarNoteRequest {
    date: string;
    noteType: CalendarNoteType;
    content: string;
}
