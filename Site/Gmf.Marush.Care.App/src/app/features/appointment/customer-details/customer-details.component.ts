/* eslint-disable no-console */
import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import Language from '@shared/models/language.model';
import AirDatepicker from 'air-datepicker';

@Component({
    selector: 'marush-appointment-customer-details',
    standalone: true,
    imports: [],
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
        console.log(today);
        console.log(nextMonth);
        new AirDatepicker(this.appointmentDate.nativeElement, {
            locale: new Language().predefined().datePickerLocale,
            autoClose: true,
            showOtherMonths: false,
            moveToOtherMonthsOnSelect: false,
            selectOtherMonths: false,
            minDate: today,
            maxDate: nextMonth
// OnlyTimepicker: true,
// Timepicker: true,
// MinutesStep: 15,
// MaxHours: 20,
// MinHours: 12,
// MinMinutes: 0,
// MaxMinutes: 45,
// StartDate: new Date(2024, 0, 1, 12, 0)
        });
    }

    readonly toggleDatePicker = () => this.datePicker?.show();
}
