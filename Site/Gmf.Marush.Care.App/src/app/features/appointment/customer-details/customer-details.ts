import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComboBox } from '@shared/components/forms/combobox/combobox';
import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import { DatePicker } from '@shared/components/forms/date-picker/date-picker';
import { Input } from '@shared/components/forms/input/input';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-appointment-customer-details',
    imports: [ComboBox, Input, DatePicker, ReactiveFormsModule],
    templateUrl: './customer-details.html',
    styleUrl: './customer-details.scss'
})
export class CustomerDetails {
    @HostBinding('class') classAttribute: string = 'row customer-details-container';
    readonly formGroup = input.required<FormGroup>();
    protected readonly namePlaceholder = $localize`:@@appointment.customer.name:Ime`;
    protected readonly surnamePlaceholder = $localize`:@@appointment.customer.surname:Prezime`;
    protected readonly phonePlaceholder = $localize`:@@appointment.customer.phone:Telefon`;
    protected readonly emailPlaceholder = $localize`:@@email:Email`;
    protected readonly phoneValidationMessage = $localize`:@@validation.phone.pattern:Telefon mora biti u formatu 06XXXXXXXX ili +XXXXXXXXXXXX`;
    protected readonly datePlaceholder = $localize`:@@appointment.customer.date:Datum`;
    protected readonly timePlaceholder = $localize`:@@appointment.customer.time:Vreme`;

    protected readonly timeGroup = () => this.formGroup().get('timeGroup') as FormGroup;

    protected readonly timeIntervals = () => {
        const workingHoursAmount = 480;
        const minutesInterval = 15;
        const beginningHour = 12;
        const minutesInHour = 60;
        const digitsInHour = 2;

        return Array.from({ length: workingHoursAmount / minutesInterval + 1 }, (_, index) => {
            const totalMinutes = index * minutesInterval;
            const hour = beginningHour + Math.floor(totalMinutes / minutesInHour);
            const minutePart = totalMinutes % minutesInHour;
            const value = `${hour.toString().padStart(digitsInHour, '0')}:${minutePart.toString().padStart(digitsInHour, '0')}`;
            return {
                label: value,
                value
            } as IComboBoxItem;
        });
    };
}
