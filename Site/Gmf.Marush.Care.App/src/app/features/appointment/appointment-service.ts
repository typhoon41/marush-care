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


    readonly makeRequest = async(data: AppointmentRequest, captchaToken: string, captchaAction: string) => {
        const appointmentUrl = `${environment.apiUrl}appointment`;
        await lastValueFrom(this.http.post<AppointmentRequest>(appointmentUrl, data, {
            headers: { Captcha: captchaToken, CaptchaAction: captchaAction }
        }));
    };
}
