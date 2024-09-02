import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ComboBoxComponent } from '@shared/components/forms/combobox/combobox.component';
import Language from '@shared/models/language.model';
import AirDatepicker from 'air-datepicker';

@Component({
    selector: 'marush-appointment-customer-details',
    standalone: true,
    imports: [ComboBoxComponent],
    templateUrl: './customer-details.component.html',
    styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent implements OnInit {
    @HostBinding('class') classAttribute: string = 'row customer-details-container';
    @ViewChild('appointmentDate', { static: true }) public appointmentDate!: ElementRef<HTMLInputElement>;
    datePicker: AirDatepicker | undefined;

    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    ngOnInit(): void {
        const today = new Date();
        const nextMonth = new Date(new Date().setMonth(today.getMonth() + 1));
        new AirDatepicker(this.appointmentDate.nativeElement, {
            locale: new Language().predefined().datePickerLocale,
            autoClose: true,
            showOtherMonths: false,
            moveToOtherMonthsOnSelect: false,
            selectOtherMonths: false,
            minDate: today,
            maxDate: nextMonth,
            onBeforeSelect: ({ date }) => date.getDay() !== 0,
            onRenderCell: ({ date, cellType }) => {
                if (cellType === 'day' && date.getDay() === 0) {
                    return {
                        disabled: true
                    };
                }

                return {};
            }
        });
    }

    readonly toggleDatePicker = () => this.datePicker?.show();
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
            return `${hour.toString().padStart(digitsInHour, '0')}:${minutePart.toString().padStart(digitsInHour, '0')}`;
        });
    };
}
