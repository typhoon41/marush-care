export interface CalendarNoteRequest {
    date: string;
    noteType: 'Daily' | 'Weekly';
    content: string;
}
