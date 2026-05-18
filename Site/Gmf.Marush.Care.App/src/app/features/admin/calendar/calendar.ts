import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '@env';
import { Authentication } from '@shared/services/authentication';
import { lastValueFrom } from 'rxjs';
import { CalendarEntryRequest } from './calendar-entry-request';
import { CalendarNoteRequest } from './calendar-note-request';
import { CalendarWeek } from './calendar-week';

@Injectable({ providedIn: 'root' })
export class Calendar {
    private static readonly endpoint = `${environment.apiUrl}calendar`;
    private readonly authentication = inject(Authentication);
    private readonly http = inject(HttpClient);

    readonly getWeek = (weekStart: Signal<string>) => httpResource<CalendarWeek>(() => ({
        url: `${Calendar.endpoint}/week`,
        method: 'GET',
        params: { weekStart: weekStart() },
        headers: this.headers()
    }));

    readonly createEntry = (request: CalendarEntryRequest) =>
        lastValueFrom(this.http.post<void>(`${Calendar.endpoint}/entry`, request, { headers: this.headers() }));

    readonly updateEntry = (id: string, request: CalendarEntryRequest) =>
        lastValueFrom(this.http.put<void>(`${Calendar.endpoint}/entry/${id}`, request, { headers: this.headers() }));

    readonly deleteEntry = (id: string) =>
        lastValueFrom(this.http.delete<void>(`${Calendar.endpoint}/entry/${id}`, { headers: this.headers() }));

    readonly upsertNote = (request: CalendarNoteRequest) =>
        lastValueFrom(this.http.post<void>(`${Calendar.endpoint}/note`, request, { headers: this.headers() }));

    readonly deleteNote = (id: string) =>
        lastValueFrom(this.http.delete<void>(`${Calendar.endpoint}/note/${id}`, { headers: this.headers() }));

    private readonly headers = () => ({
        Authorization: `Bearer ${this.authentication.getToken()}`,
        'Content-Type': 'application/json'
    });
}
