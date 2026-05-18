export interface CalendarEntry {
    id: string;
    appointmentId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
    money?: number;
}

export interface PublicAppointment {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    clientName: string;
    phone: string;
    email: string;
    status: string;
    description?: string;
}

export interface CalendarNote {
    id: string;
    date: string;
    noteType: 'Daily' | 'Weekly';
    content: string;
}

export interface CalendarWeek {
    weekStart: string;
    entries: CalendarEntry[];
    publicAppointments: PublicAppointment[];
    notes: CalendarNote[];
}

export interface CalendarEntryRequest {
    date: string;
    startTime: string;
    endTime: string;
    customerId?: string;
    appointmentId?: string;
    notes?: string;
    money?: number;
}

export interface CalendarNoteRequest {
    date: string;
    noteType: 'Daily' | 'Weekly';
    content: string;
}

export interface SlotAddress {
    date: string;
    time: string;
}

export interface DayInfo {
    isoDate: string;
    label: string;
    dailyTotal: number;
}
