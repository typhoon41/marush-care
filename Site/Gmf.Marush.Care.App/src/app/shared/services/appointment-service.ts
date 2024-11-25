import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { AppointmentRequest } from '@features/appointment/appointment-request.model';
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    constructor(private readonly http: HttpClient) { }

    // eslint-disable-next-line @typescript-eslint/return-await
    readonly makeRequest = async(data: AppointmentRequest) => {
        const appointmentUrl = `${environment.apiUrl}appointment`;
        await lastValueFrom(this.http.post<AppointmentRequest>(appointmentUrl, data));
    };
}