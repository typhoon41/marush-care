import { ChangeDetectionStrategy, Component, computed, effect, inject, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Dialog } from '@shared/components/dialog/dialog';
import { ComboBox } from '@shared/components/forms/combobox/combobox';
import { Input } from '@shared/components/forms/input/input';
import { Clients } from '../../clients/clients';
import { Calendar } from '../calendar';
import { CalendarEntry } from '../calendar-entry';
import {
    IComboBoxItem, buildClientSearchForm, buildEntryForm, buildEntryRequest,
    buildFormValue, filterClientResults, findTimeOption, minSearchLength, timeOptions
} from './calendar-entry-form';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-calendar-entry-dialog',
    imports: [ComboBox, Dialog, Input, ReactiveFormsModule],
    templateUrl: './calendar-entry-dialog.html',
    styleUrl: './calendar-entry-dialog.scss'
})
export class CalendarEntryDialog {
    readonly saved = output<void>();
    readonly deleted = output<void>();
    private readonly dialog = viewChild.required(Dialog);
    private readonly calendarService = inject(Calendar);
    private readonly clientsService = inject(Clients);
    protected readonly timeOptions = timeOptions;
    protected readonly editingEntry = signal<CalendarEntry | null>(null);
    protected readonly selectedStartTime = signal<IComboBoxItem | undefined>(undefined);
    protected readonly selectedEndTime = signal<IComboBoxItem | undefined>(undefined);
    protected readonly clientSearchResults = signal<{ id: string; label: string }[]>([]);
    protected readonly isLoading = signal(false);
    protected readonly form = buildEntryForm();
    protected readonly clientSearchForm = buildClientSearchForm();
    private readonly entryFormValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
    private readonly clientSearchValues = toSignal(this.clientSearchForm.valueChanges, { initialValue: this.clientSearchForm.value });

    protected readonly showRescheduleWarning = computed(() => {
        const entry = this.editingEntry();
        if (!entry) {
            return false;
        }
        const values = this.entryFormValues();
        return values.date !== entry.date || values.startTime !== entry.startTime || values.endTime !== entry.endTime;
    });

    private readonly clientSearchEffect = effect(() => {
        const query = this.clientSearchValues().query;
        if ((query?.length ?? 0) < minSearchLength) {
            this.clientSearchResults.set([]);
            return;
        }
        const resource = this.clientsService.getAll();
        resource.reload();
        if (resource.hasValue()) {
            this.clientSearchResults.set(filterClientResults(resource.value().items as { id: string; fullName: string }[], query));
        }
    });

    readonly open = (date?: string, startTime?: string, endTime?: string, entry?: CalendarEntry) => {
        this.editingEntry.set(entry ?? null);
        this.form.reset(buildFormValue(date, startTime, endTime, entry));
        this.clientSearchForm.reset();
        this.selectedStartTime.set(findTimeOption(startTime ?? entry?.startTime));
        this.selectedEndTime.set(findTimeOption(endTime ?? entry?.endTime));
        this.dialog().open();
    };

    protected readonly selectClient = (client: { id: string; label: string }) => {
        this.form.patchValue({ customerId: client.id });
        this.clientSearchForm.reset();
        this.clientSearchResults.set([]);
    };

    protected readonly onSave = async() => {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.isLoading.set(true);
        try {
            const request = buildEntryRequest(this.form.value);
            const entry = this.editingEntry();
            await (entry ? this.calendarService.updateEntry(entry.id, request) : this.calendarService.createEntry(request));
            this.dialog().dismiss();
            this.saved.emit();
        } finally {
            this.isLoading.set(false);
        }
    };

    protected readonly onDelete = async() => {
        const entry = this.editingEntry();
        if (!entry) {
            return;
        }
        this.isLoading.set(true);
        try {
            await this.calendarService.deleteEntry(entry.id);
            this.dialog().dismiss();
            this.deleted.emit();
        } finally {
            this.isLoading.set(false);
        }
    };
}
