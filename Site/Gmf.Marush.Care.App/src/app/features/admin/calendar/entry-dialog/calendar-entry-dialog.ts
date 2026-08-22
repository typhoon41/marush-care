import { ChangeDetectionStrategy, Component, inject, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from '@shared/components/dialog/dialog';
import { DialogOperation } from '@shared/components/dialog/dialog-operation';
import { Autocomplete } from '@shared/components/forms/autocomplete/autocomplete';
import { ComboBox } from '@shared/components/forms/combobox/combobox';
import { DatePicker } from '@shared/components/forms/date-picker/date-picker';
import { Input } from '@shared/components/forms/input/input';
import { TreatmentList } from '@shared/components/treatments/list/list';
import { Clients } from '../../clients/clients';
import { Calendar } from '../calendar';
import { CalendarEntry } from '../calendar-entry';
import { CalendarSelection } from '../calendar-selection';
import { endTimeOptions, startTimeOptions } from '../calendar-time-slots';
import { buildEntryErrors } from './calendar-entry-errors';
import {
    IComboBoxItem, buildEntryForm, buildEntryRequest, buildFormValue,
    buildRescheduleWarning, findTimeOption, toPickerDate
} from './calendar-entry-form';
import { ClientSelection } from './client-selection';
import { MoneySynchronization } from './money-synchronization';
import { TreatmentSelection } from './treatment-selection';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-calendar-entry-dialog',
    imports: [Autocomplete, ComboBox, DatePicker, Dialog, Input, ReactiveFormsModule, TreatmentList],
    templateUrl: './calendar-entry-dialog.html',
    styleUrl: './calendar-entry-dialog.scss'
})
export class CalendarEntryDialog {
    readonly saved = output<void>();
    readonly deleted = output<void>();
    private readonly dialog = viewChild.required(Dialog);
    private readonly calendarService = inject(Calendar);
    private readonly formBuilder = inject(NonNullableFormBuilder);
    protected readonly startTimeOptions = startTimeOptions;
    protected readonly endTimeOptions = endTimeOptions;
    protected readonly editingEntry = signal<CalendarEntry | null>(null);
    protected readonly selectedStartTime = signal<IComboBoxItem | undefined>(undefined);
    protected readonly selectedEndTime = signal<IComboBoxItem | undefined>(undefined);
    protected readonly operation = new DialogOperation();
    protected readonly saveAttempted = signal(false);
    protected readonly pickerDate = signal<Date | undefined>(undefined);
    protected readonly form = buildEntryForm(this.formBuilder);
    protected readonly clientSelection = new ClientSelection(this.formBuilder, inject(Clients), this.form);
    protected readonly treatmentSelection = new TreatmentSelection(this.formBuilder);
    private readonly moneySynchronization = new MoneySynchronization(this.treatmentSelection.priceTotal, this.form);
    private readonly entryFormValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
    protected readonly showRescheduleWarning = buildRescheduleWarning(this.editingEntry, this.entryFormValues);
    protected readonly errors = buildEntryErrors(this.saveAttempted, this.clientSelection.interacted, this.entryFormValues);

    readonly open = (selection?: CalendarSelection, entry?: CalendarEntry) => {
        this.editingEntry.set(entry ?? null);
        this.form.reset(buildFormValue(selection, entry));
        this.clientSelection.reset(entry?.clientName);
        this.treatmentSelection.reset(entry?.treatments ?? []);
        this.selectedStartTime.set(findTimeOption(selection?.interval.startTime ?? entry?.startTime));
        this.selectedEndTime.set(findTimeOption(selection?.interval.endTime ?? entry?.endTime));
        this.pickerDate.set(toPickerDate(selection?.date ?? entry?.date));
        this.saveAttempted.set(false);
        this.operation.reset();
        this.moneySynchronization.reset(entry?.money);
        this.dialog().open();
    };

    protected readonly onSave = async() => {
        this.saveAttempted.set(true);
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (await this.operation.run(() => this.persist())) {
            this.dialog().dismiss();
            this.saved.emit();
        }
    };

    protected readonly onDelete = async() => {
        const entry = this.editingEntry();
        if (!entry) {
            return;
        }
        if (await this.operation.run(() => this.calendarService.deleteEntry(entry.id))) {
            this.dialog().dismiss();
            this.deleted.emit();
        }
    };

    private readonly persist = (): Promise<void> => {
        const request = buildEntryRequest(this.form.getRawValue(), this.treatmentSelection.selectedNames());
        const entry = this.editingEntry();
        return entry ? this.calendarService.updateEntry(entry.id, request) : this.calendarService.createEntry(request);
    };
}
