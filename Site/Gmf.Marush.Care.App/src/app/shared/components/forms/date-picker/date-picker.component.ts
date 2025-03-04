import { afterNextRender, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import Language from '@shared/models/language.model';
import AirDatepicker from 'air-datepicker';
import { Field } from '../field';

@Component({
    selector: 'marush-date-picker',
    imports: [ReactiveFormsModule],
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent extends Field {
    @Input({ required: true }) form!: FormGroup;
    @Input({ required: true }) name = '';
    @Input() placeholder = '';
    @ViewChild('date', { static: true }) date!: ElementRef<HTMLInputElement>;
    datePicker: AirDatepicker | undefined;
    validation = ['required'];

    constructor() {
        super();
        afterNextRender(() => {
            const today = new Date();
            const nextMonth = new Date(new Date().setMonth(today.getMonth() + 1));

            new AirDatepicker(this.date.nativeElement, {
                locale: new Language().predefined().datePickerLocale,
                autoClose: true,
                showOtherMonths: false,
                moveToOtherMonthsOnSelect: false,
                selectOtherMonths: false,
                minDate: today,
                maxDate: nextMonth,
                onBeforeSelect: ({ date }) => date.getDay() !== 0,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
                onSelect: ({ date, formattedDate, datepicker }) => {
                    this.form.get(this.name)?.setValue(formattedDate);
                },
                onRenderCell: ({ date, cellType }) => {
                    if (cellType === 'day' && date.getDay() === 0) {
                        return {
                            disabled: true
                        };
                    }

                    return {};
                }
            });
        });
    }

    readonly toggleDatePicker = () => this.datePicker?.show();
}
