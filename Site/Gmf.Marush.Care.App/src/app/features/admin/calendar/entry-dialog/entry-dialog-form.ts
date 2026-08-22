import { Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder } from '@angular/forms';
import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import { Clients } from '../../clients/clients';
import { CalendarDate } from '../calendar-date';
import { CalendarEntry } from '../calendar-entry';
import { CalendarEntryRequest } from '../calendar-entry-request';
import { CalendarSelection } from '../calendar-selection';
import { CalendarTimeSlots } from '../calendar-time-slots';
import { ClientSelection } from './client-selection';
import { EntryErrors } from './entry-errors';
import { EntryForm, buildEntryForm } from './entry-form';
import { EntryFormValue } from './entry-form-value';
import { MoneySynchronization } from './money-synchronization';
import { RescheduleWarning } from './reschedule-warning';
import { TreatmentSelection } from './treatment-selection';

/** Everything the entry dialog binds to: the form itself and the selections that feed it. */
export class EntryDialogForm {
    readonly startTimeOptions = CalendarTimeSlots.startOptions;
    readonly endTimeOptions = CalendarTimeSlots.endOptions;
    readonly selectedStartTime = signal<IComboBoxItem | undefined>(undefined);
    readonly selectedEndTime = signal<IComboBoxItem | undefined>(undefined);
    readonly pickerDate = signal<Date | undefined>(undefined);
    readonly saveAttempted = signal(false);

    readonly group: EntryForm;
    readonly clientSelection: ClientSelection;
    readonly treatmentSelection: TreatmentSelection;
    readonly errors: EntryErrors;
    readonly rescheduleWarning: RescheduleWarning;
    private readonly moneySynchronization: MoneySynchronization;

    constructor(formBuilder: NonNullableFormBuilder, clients: Clients, editingEntry: Signal<CalendarEntry | null>) {
        this.group = buildEntryForm(formBuilder);
        this.clientSelection = new ClientSelection(formBuilder, clients, this.group);
        this.treatmentSelection = new TreatmentSelection(formBuilder);
        this.moneySynchronization = new MoneySynchronization(this.treatmentSelection.priceTotal, this.group);

        const values = toSignal(this.group.valueChanges, { initialValue: this.group.value });
        this.rescheduleWarning = new RescheduleWarning(editingEntry, values);
        this.errors = new EntryErrors(this.saveAttempted, this.clientSelection.interacted, values);
    }

    readonly reset = (selection?: CalendarSelection, entry?: CalendarEntry) => {
        this.group.reset(EntryFormValue.for(selection, entry));
        this.clientSelection.reset(entry?.clientName);
        this.treatmentSelection.reset(entry?.treatments ?? []);
        this.selectedStartTime.set(CalendarTimeSlots.findOption(selection?.interval.startTime ?? entry?.startTime));
        this.selectedEndTime.set(CalendarTimeSlots.findOption(selection?.interval.endTime ?? entry?.endTime));
        this.pickerDate.set(EntryDialogForm.toPickerDate(selection?.date ?? entry?.date));
        this.saveAttempted.set(false);
        this.moneySynchronization.reset(entry?.money);
    };

    readonly acceptsSave = (): boolean => {
        this.saveAttempted.set(true);
        if (this.group.valid) {
            return true;
        }

        this.group.markAllAsTouched();
        return false;
    };

    readonly toRequest = (): CalendarEntryRequest =>
        CalendarEntryRequest.from(this.group.getRawValue(), this.treatmentSelection.selectedNames());

    static toPickerDate = (isoDate?: string): Date => {
        if (!isoDate) {
            return new Date();
        }

        return CalendarDate.fromIso(isoDate).toDate();
    };
}
