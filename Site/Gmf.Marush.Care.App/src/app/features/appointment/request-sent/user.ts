import { FormGroup } from '@angular/forms';
import { Money } from '@shared/pipes/money';

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
        sum: new Money().transform(form.get('sum')?.value ?? 0),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        time: `${RequestUser.toIsoFormat(form.get('date')?.value!)}T${form.get('time')?.value}`,
        services: (form.get('treatments')?.value as unknown as string[]).join(' & ')
    } as IRepresentUserRequest);

    private static toIsoFormat = (date: string) => {
        const normalizedDate = date.trim().replace(/\.$/u, '')
            .replace(/\//ug, '.');
        const dayMonthLimit = 2;
        const [day, month, year] = normalizedDate.split('.').map(Number);
        return `${year}-${String(month).padStart(dayMonthLimit, '0')}-${String(day).padStart(dayMonthLimit, '0')}`;
    };
}

