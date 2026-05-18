export interface CalendarEntry {
    id: string;
    appointmentId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
    money?: number;
}
