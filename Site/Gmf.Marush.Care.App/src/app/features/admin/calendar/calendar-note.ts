import { CalendarNoteType } from './calendar-note-type';

export interface CalendarNote {
    id: string;
    date: string;
    noteType: CalendarNoteType;
    content: string;
}
