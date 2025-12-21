import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Language from '@shared/models/language';
import AirDatepicker from 'air-datepicker';
import { Field } from '../field';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-date-picker',
    imports: [ReactiveFormsModule],
    templateUrl: './date-picker.html',
    styleUrl: './date-picker.scss'
})
export class DatePicker extends Field {
    readonly form = input.required<FormGroup>();
    readonly control = input<FormControl | undefined>(undefined);
    readonly name = input.required<string | number>();
    readonly placeholder = input<string>('');
    readonly validation = input<string[]>(['required']);
    readonly startDate = input<Date | undefined>();
    readonly date = viewChild<ElementRef<HTMLInputElement>>('date');
    // eslint-disable-next-line @angular-eslint/prefer-signals
    private datePicker = signal<AirDatepicker | undefined>(undefined);

    protected readonly showDatePicker = () => {
        if (!this.datePicker()) {
            {
                const today = new Date();
                const nextMonth = new Date(new Date().setMonth(today.getMonth() + 1));
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.datePicker.set(new AirDatepicker(this.date()!.nativeElement, {
                    locale: new Language().predefined().datePickerLocale,
                    autoClose: true,
                    showOtherMonths: false,
                    moveToOtherMonthsOnSelect: false,
                    startDate: this.startDate(),
                    selectOtherMonths: false,
                    minDate: this.startDate() ? undefined : today,
                    maxDate: this.startDate() ? undefined : nextMonth,
                    onBeforeSelect: ({ date }) => !!this.startDate() || date.getDay() !== 0,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
                    onSelect: ({ date, formattedDate, datepicker }) => {
                        this.resolvedControl?.setValue(formattedDate);
                    },
                    onRenderCell: ({ date, cellType }) => {
                        if (cellType === 'day' && date.getDay() === 0 && !this.startDate()) {
                            return {
                                disabled: true
                            };
                        }
                        return {};
                    }
                }));
            }

            this.datePicker()?.show();
        }
    };
}
