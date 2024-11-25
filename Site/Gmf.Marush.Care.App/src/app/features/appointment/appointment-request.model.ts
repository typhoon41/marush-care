export interface AppointmentRequest {
    name: string;
    surname: string;
    email: string;
    phone: string;
    treatments: string[];
    serbianTreatments: string[];
    sum: number;
    date: string;
    time: string;
    duration: number;
}
