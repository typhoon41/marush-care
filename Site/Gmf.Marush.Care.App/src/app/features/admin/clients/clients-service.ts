import { httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env';
import { PaginatedRequest } from '@shared/components/pagination/request.model';
import { PaginatedResponse } from '@shared/components/pagination/table/table-metadata.model';
import { AuthenticationService } from '@shared/services/authentication-service';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private readonly authenticationService = inject(AuthenticationService);
    readonly data = signal<PaginatedRequest>(new PaginatedRequest('fullName'));

    readonly getCustomers = () => {
        const appointmentUrl = `${environment.apiUrl}customer/get-all`;
        return httpResource<PaginatedResponse>(() => ({
            url: appointmentUrl,
            method: 'POST',
            body: this.data().toJson(),
            headers: {
                Authorization: `Bearer ${this.authenticationService.getToken()}`,
                'Content-Type': 'application/json'
            }
        }));
    };
}
