import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env';
import { PaginatedRequest } from '@shared/components/pagination/request.model';
import { PaginatedResponse } from '@shared/components/pagination/table/table-metadata.model';
import { AuthenticationService } from '@shared/services/authentication-service';
import { ClientPreview } from './clients.model';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private readonly authenticationService = inject(AuthenticationService);

    readonly getCustomers = (data: PaginatedRequest) => {
        const appointmentUrl = `${environment.apiUrl}customer/get-all`;
        return httpResource<PaginatedResponse<ClientPreview>>(() => ({
            url: appointmentUrl,
            method: 'POST',
            body: data,
            headers: {
                Authorization: `Bearer ${this.authenticationService.getToken()}`,
                'Content-Type': 'application/json'
            }
        }));
    };
}
