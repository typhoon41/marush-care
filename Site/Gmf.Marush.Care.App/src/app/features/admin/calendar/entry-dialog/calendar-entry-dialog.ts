import { ChangeDetectionStrategy, Component, effect, inject, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from '@shared/components/dialog/dialog';
import { ComboBox } from '@shared/components/forms/combobox/combobox';
import { IComboBoxItem } from '@shared/components/forms/combobox/item';
import { Input } from '@shared/components/forms/input/input';
import { Clients } from '../../clients/clients';
import { Calendar } from '../calendar';
import { CalendarEntry } from '../calendar-entry';
import { buildEntryRequest, buildFormValue, filterClientResults, minSearchLength, timeOptions } from './calendar-entry-dialog-helpers';

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
    private readonly formBuilder = inject(FormBuilder);
    protected readonly timeOptions = timeOptions;
    protected readonly editingEntry = signal<CalendarEntry | null>(null);
    protected readonly showRescheduleWarning = signal(false);
    protected readonly selectedStartTime = signal<IComboBoxItem | undefined>(undefined);
    protected readonly selectedEndTime = signal<IComboBoxItem | undefined>(undefined);
    protected readonly clientSearchResults = signal<{ id: string; label: string }[]>([]);
    protected readonly isLoading = signal(false);
    protected readonly form: FormGroup = this.formBuilder.nonNullable.group({
        date: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        customerId: [''],
        appointmentId: [''],
        notes: [''],
        money: [null as number | null]
    }, { updateOn: 'blur' });
    protected readonly clientSearchForm: FormGroup = this.formBuilder.nonNullable.group({
        query: this.formBuilder.nonNullable.control('', { updateOn: 'change' })
    });
    private readonly entryFormValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
    private readonly clientSearchValues = toSignal(this.clientSearchForm.valueChanges, { initialValue: this.clientSearchForm.value });

    constructor() {
        effect(() => {
            const values = this.entryFormValues();
            const entry = this.editingEntry();
            if (!entry) {
                return;
            }
            const changed = values.date !== entry.date || values.startTime !== entry.startTime || values.endTime !== entry.endTime;
            this.showRescheduleWarning.set(changed);
        });

        effect(() => {
            const query = this.clientSearchValues().query;
            if ((query?.length ?? 0) < minSearchLength) {
                this.clientSearchResults.set([]);
                return;
            }
            const resource = this.clientsService.getAll();
            resource.reload();
            if (resource.hasValue()) {
                const items = resource.value().items as { id: string; fullName: string }[];
                this.clientSearchResults.set(filterClientResults(items, query));
            }
        });
    }

    readonly open = (date?: string, startTime?: string, endTime?: string, entry?: CalendarEntry) => {
        this.editingEntry.set(entry ?? null);
        this.showRescheduleWarning.set(false);
        this.form.reset(buildFormValue(date, startTime, endTime, entry));
        this.clientSearchForm.reset();
        const resolvedStartTime = startTime ?? entry?.startTime;
        const resolvedEndTime = endTime ?? entry?.endTime;
        this.selectedStartTime.set(resolvedStartTime ? timeOptions.find(option => option.value === resolvedStartTime) : undefined);
        this.selectedEndTime.set(resolvedEndTime ? timeOptions.find(option => option.value === resolvedEndTime) : undefined);
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
            await (entry
                ? this.calendarService.updateEntry(entry.id, request)
                : this.calendarService.createEntry(request));
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
