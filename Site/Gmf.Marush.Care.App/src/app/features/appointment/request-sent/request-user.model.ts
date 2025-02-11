import { FormGroup } from '@angular/forms';
import { MoneyPipe } from '@shared/pipes/money-pipe';

const toIsoFormat = (date: string) => {
    const normalizedDate = date.trim().replace(/\.$/u, '')
        .replace(/\//ug, '.');
    const dayMonthLimit = 2;
    const [day, month, year] = normalizedDate.split('.').map(Number);
    return `${year}-${String(month).padStart(dayMonthLimit, '0')}-${String(day).padStart(dayMonthLimit, '0')}`;
};

export interface IRepresentUserRequest {
    fullName: string;
    email: string;
    phone: string;
    sum: string;
    time: string;
    services: string;
}

export class RequestUser {
    static readonly from = (form: FormGroup<object>) => ({
        fullName: `${form.get('name')?.value} ${form.get('surname')?.value}`,
        email: form.get('email')?.value ?? '',
        phone: form.get('phone')?.value ?? '',
        sum: new MoneyPipe().transform(form.get('sum')?.value ?? 0),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        time: `${toIsoFormat(form.get('date')?.value!)}T${form.get('time')?.value}+01:00`,
        services: (form.get('treatments')?.value as unknown as string[]).join(' & ')
    } as IRepresentUserRequest);
}

