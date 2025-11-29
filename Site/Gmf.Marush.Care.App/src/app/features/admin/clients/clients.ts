import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env';
import { PaginatedRequest } from '@shared/components/pagination/paginated-request';
import { PaginatedResponse } from '@shared/components/pagination/table/table-metadata';
import { Authentication } from '@shared/services/authentication';
import { lastValueFrom } from 'rxjs';
import { ClientEditRequest } from './edit/request';

@Injectable({
    providedIn: 'root'
})
export class Clients {
    private readonly authentication = inject(Authentication);
    private readonly http = inject(HttpClient);
    private readonly customerEndpoint = `${environment.apiUrl}customer`;
    readonly data = signal<PaginatedRequest>(new PaginatedRequest('fullName'));

    readonly getAll = () => {
        const appointmentUrl = `${this.customerEndpoint}/get-all`;
        return httpResource<PaginatedResponse>(() => ({
            url: appointmentUrl,
            method: 'POST',
            body: this.data().toJson(),
            headers: {
                Authorization: `Bearer ${this.authentication.getToken()}`,
                'Content-Type': 'application/json'
            }
        }));
    };

    readonly storeChanges = async(data: ClientEditRequest, id: string | undefined, captchaToken: string, captchaAction: string) => {
        if (id) {
            // Can't be switched to httpResource because of lack of reactivity in Captcha service.
            await lastValueFrom(this.http.put<ClientEditRequest>(this.customerEndpoint, data, {
                headers: { Captcha: captchaToken, CaptchaAction: captchaAction }
            }));
        }

        else {
            // Can't be switched to httpResource because of lack of reactivity in Captcha service.
            await lastValueFrom(this.http.post<ClientEditRequest>(this.customerEndpoint, data, {
                headers: { Captcha: captchaToken, CaptchaAction: captchaAction }
            }));
        }
    };
}
