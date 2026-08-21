export class CalendarEntryRequest {
    date: string = '';
    startTime: string = '';
    endTime: string = '';
    customerId?: string;
    appointmentId?: string;
    notes?: string;
    money?: number;
    treatments: string[] = [];
}
