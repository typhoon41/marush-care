import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { LoginRequest } from '@shared/models/authentication/login-request';
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(private readonly http: HttpClient) { }

    readonly login = async(data: LoginRequest, captchaToken: string, captchaAction: string) => {
        const loginUrl = `${environment.apiUrl}user/login`;
        await lastValueFrom(this.http.post<LoginRequest>(loginUrl, data, {
            headers: { Captcha: captchaToken, CaptchaAction: captchaAction }
        }));
    };
}
