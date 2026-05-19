import { ChangeDetectionStrategy, Component, inject, output, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from '@shared/components/dialog/dialog';
import { Input } from '@shared/components/forms/input/input';
import { Clients } from '../../clients/clients';
import { Calendar } from '../calendar';
import { CalendarEntry } from '../calendar-entry';
import { buildEntryRequest, buildFormValue, filterClientResults, minSearchLength, timeOptions } from './calendar-entry-dialog-helpers';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-calendar-entry-dialog',
    imports: [Dialog, Input, ReactiveFormsModule],
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

    readonly open = (date?: string, start?: string, end?: string, entry?: CalendarEntry) => {
        this.editingEntry.set(entry ?? null);
        this.showRescheduleWarning.set(false);
        this.form.reset(buildFormValue(date, start, end, entry));
        this.dialog().open();
    };

    protected readonly onTimeChange = () => {
        const entry = this.editingEntry();
        if (entry) {
            const { date, startTime, endTime } = this.form.value;
            const changed = date !== entry.date || startTime !== entry.startTime || endTime !== entry.endTime;
            this.showRescheduleWarning.set(changed);
        }
    };

    protected readonly onSearchInput = (event: Event) => {
        const value = (event.target as HTMLInputElement).value;
        if ((value?.length ?? 0) < minSearchLength) {
            this.clientSearchResults.set([]);
            return;
        }
        const resource = this.clientsService.getAll();
        resource.reload();
        if (resource.hasValue()) {
            const items = resource.value().items as { id: string; fullName: string }[];
            this.clientSearchResults.set(filterClientResults(items, value));
        }
    };

    protected readonly selectClient = (client: { id: string; label: string }) => {
        this.form.patchValue({ customerId: client.id });
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
