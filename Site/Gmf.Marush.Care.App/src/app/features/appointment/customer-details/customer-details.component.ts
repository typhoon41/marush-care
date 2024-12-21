import { Component, HostBinding, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComboBoxComponent } from '@shared/components/forms/combobox/combobox.component';
import { IComboBoxItem } from '@shared/components/forms/combobox/combobox.model';
import { DatePickerComponent } from '@shared/components/forms/date-picker/date-picker.component';
import { InputComponent } from '@shared/components/forms/input/input.component';

@Component({
    selector: 'marush-appointment-customer-details',
    imports: [ComboBoxComponent, InputComponent, DatePickerComponent, ReactiveFormsModule],
    templateUrl: './customer-details.component.html',
    styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent {
    @HostBinding('class') classAttribute: string = 'row customer-details-container';
    @Input({ required: true }) formGroup!: FormGroup;
    readonly namePlaceholder = $localize`:@@appointment.customer.name:Ime`;
    readonly surnamePlaceholder = $localize`:@@appointment.customer.surname:Prezime`;
    readonly phonePlaceholder = $localize`:@@appointment.customer.phone:Telefon`;
    readonly emailPlaceholder = $localize`:@@email:Email`;
    readonly phoneValidationMessage = $localize`:@@validation.phone.pattern:Telefon mora biti u formatu 06XXXXXXXX ili +XXXXXXXXXXXX`;
    readonly datePlaceholder = $localize`:@@appointment.customer.date:Datum`;
    readonly timePlaceholder = $localize`:@@appointment.customer.time:Vreme`;

    get timeGroup() {
        return this.formGroup.get('timeGroup') as FormGroup;
    }

    readonly timeIntervals = () => {
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
