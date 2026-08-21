import { ChangeDetectionStrategy, Component, ElementRef, effect, input, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isCancel } from '@shared/functions/keyboard-event';
import Language from '@shared/models/language';
import AirDatepicker, { AirDatepickerOptions } from 'air-datepicker';
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
    readonly selectedDate = input<Date | undefined>(undefined);
    readonly date = viewChild<ElementRef<HTMLInputElement>>('date');
    // eslint-disable-next-line @angular-eslint/prefer-signals
    private datePicker = signal<AirDatepicker | undefined>(undefined);

    constructor() {
        super();
        effect(() => {
            const picker = this.datePicker();
            const selectedDate = this.selectedDate();
            if (picker && selectedDate) {
                picker.selectDate(selectedDate, { silent: true, updateTime: false });
                picker.setViewDate(selectedDate);
            }
        });
    }

    protected readonly showDatePicker = () => {
        if (!this.datePicker()) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.datePicker.set(new AirDatepicker(this.date()!.nativeElement, this.datePickerOptions()));
            this.datePicker()?.show();
        }
    };

    protected readonly onKey = (event: KeyboardEvent) => {
        const picker = this.datePicker();
        if (isCancel(event) && picker?.visible) {
            event.preventDefault();
            picker.hide();
        }
    };

    private readonly datePickerOptions = (): AirDatepickerOptions => {
        const today = new Date();
        const nextMonth = new Date(new Date().setMonth(today.getMonth() + 1));
        const initiallySelectedDate = this.selectedDate();
        return {
            locale: new Language().predefined().datePickerLocale,
            container: this.date()?.nativeElement.closest('dialog') ?? undefined,
            autoClose: true,
            showOtherMonths: false,
            moveToOtherMonthsOnSelect: false,
            startDate: this.startDate(),
            selectedDates: initiallySelectedDate ? [initiallySelectedDate] : undefined,
            selectOtherMonths: false,
            minDate: this.startDate() ? undefined : today,
            maxDate: this.startDate() ? undefined : nextMonth,
            onBeforeSelect: ({ date }) => !!this.startDate() || date.getDay() !== 0,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
            onSelect: ({ date, formattedDate, datepicker }) => {
                this.resolvedControl?.setValue(formattedDate);
            },
            onRenderCell: ({ date, cellType }) => {
                const saturday = 6, sunday = 0;
                if (cellType === 'day' && (date.getDay() === sunday || date.getDay() === saturday) && !this.startDate()) {
                    return {
                        disabled: true
                    };
                }
                return {};
            }
        };
    };
}
