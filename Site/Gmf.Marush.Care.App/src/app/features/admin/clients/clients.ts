import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { environment } from '@env';
import { PaginatedRequest } from '@shared/components/pagination/paginated-request';
import { PaginatedResponse } from '@shared/components/pagination/table/table-metadata';
import { Authentication } from '@shared/services/authentication';
import { lastValueFrom } from 'rxjs';
import { Client } from './edit/request';

@Injectable({
    providedIn: 'root'
})
export class Clients {
    private readonly authentication = inject(Authentication);
    private readonly http = inject(HttpClient);
    static readonly customerEndpoint = `${environment.apiUrl}customer`;
    readonly data = signal<PaginatedRequest>(new PaginatedRequest('fullName'));

    readonly getById = (id: Signal<string | undefined>) => httpResource<Client>(() => id() ?
        {
            url: `${Clients.customerEndpoint}/${id()}`,
            method: 'GET',
            headers: this.headers()
        } : undefined);

    readonly getAll = () => {
        const appointmentUrl = `${Clients.customerEndpoint}/get-all`;
        return httpResource<PaginatedResponse>(() => ({
            url: appointmentUrl,
            method: 'POST',
            body: this.data().toJson(),
            headers: this.headers()
        }));
    };

    readonly storeChanges = async(data: Client, id: string | undefined, captchaToken: string, captchaAction: string) => {
        if (id) {
            data.id = id;
            // Can't be switched to httpResource because of lack of reactivity in Captcha service.
            await lastValueFrom(this.http.put<Client>(Clients.customerEndpoint, data, {
                headers: this.headersWithCaptcha(captchaToken, captchaAction)
            }));
        }

        else {
            // Can't be switched to httpResource because of lack of reactivity in Captcha service.
            await lastValueFrom(this.http.post<Client>(Clients.customerEndpoint, data, {
                headers: this.headersWithCaptcha(captchaToken, captchaAction)
            }));
        }
    };

    private readonly headers = () => ({
        Authorization: `Bearer ${this.authentication.getToken()}`,
        'Content-Type': 'application/json'
    });

    private readonly headersWithCaptcha = (captchaToken: string, captchaAction: string) => ({
        ...this.headers(),
        Captcha: captchaToken,
        CaptchaAction: captchaAction
    });
}
