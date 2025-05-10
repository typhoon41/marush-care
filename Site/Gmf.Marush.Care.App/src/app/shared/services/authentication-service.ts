import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { effect, Inject, Injectable, PLATFORM_ID, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@env';
import { LoginRequest } from '@shared/models/authentication/login-request';
import { fromEvent, lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly storage!: Signal<Event | undefined>;
    readonly isAuthenticated: WritableSignal<boolean> = signal(false);
    private readonly getToken = () => localStorage.getItem('token');
    private readonly store = (token: string) => localStorage.setItem('token', token);
    private readonly removeToken = () => localStorage.removeItem('token');

    constructor(@Inject(PLATFORM_ID) private readonly platformId: object, private readonly http: HttpClient) {
        if (isPlatformBrowser(this.platformId)) {
            this.storage = toSignal(fromEvent(window, 'storage'));
            this.isAuthenticated = signal(!!this.getToken());
            effect(() => {
                this.storage();
                this.isAuthenticated.set(!!this.getToken());
            });
        }
     }

    readonly login = async(data: LoginRequest, captchaToken: string, captchaAction: string) => {
        const loginUrl = `${environment.apiUrl}user/login`;
        const result = await lastValueFrom(this.http.post<{ token: string }>(loginUrl, data, {
            headers: { Captcha: captchaToken, CaptchaAction: captchaAction }
        }));
        this.store(result.token);
        this.isAuthenticated.set(true);
    };

    readonly logout = () => {
        this.removeToken();
        this.isAuthenticated.set(false);
    };
}
