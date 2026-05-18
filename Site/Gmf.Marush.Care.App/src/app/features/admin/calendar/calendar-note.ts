export interface CalendarNote {
    id: string;
    date: string;
    noteType: 'Daily' | 'Weekly';
    content: string;
}
