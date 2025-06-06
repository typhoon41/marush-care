import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import Language from '@shared/models/language.model';
import AirDatepicker from 'air-datepicker';
import { Field } from '../field';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-date-picker',
    imports: [ReactiveFormsModule],
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent extends Field {
    readonly form = input.required<FormGroup>();
    readonly name = input.required<string>();
    readonly placeholder = input<string>('');
    readonly validation = input<string[]>(['required']);
    readonly date = viewChild<ElementRef<HTMLInputElement>>('date');
    datePicker: AirDatepicker | undefined;

    constructor() {
        super();
        afterNextRender(() => {
            const today = new Date();
            const nextMonth = new Date(new Date().setMonth(today.getMonth() + 1));

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new AirDatepicker(this.date()!.nativeElement, {
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
                    this.form().get(this.name())
                        ?.setValue(formattedDate);
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
