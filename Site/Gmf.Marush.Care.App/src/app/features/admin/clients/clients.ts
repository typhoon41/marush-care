import { httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env';
import { PaginatedRequest } from '@shared/components/pagination/paginated-request';
import { PaginatedResponse } from '@shared/components/pagination/table/table-metadata';
import { Authentication } from '@shared/services/authentication';

@Injectable({
    providedIn: 'root'
})
export class Clients {
    private readonly authentication = inject(Authentication);
    readonly data = signal<PaginatedRequest>(new PaginatedRequest('fullName'));

    readonly getAll = () => {
        const appointmentUrl = `${environment.apiUrl}customer/get-all`;
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
}
