import { ChangeDetectionStrategy, Component, computed, inject, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from '@shared/components/dialog/dialog';
import { Autocomplete } from '@shared/components/forms/autocomplete/autocomplete';
import { ComboBox } from '@shared/components/forms/combobox/combobox';
import { Input } from '@shared/components/forms/input/input';
import { TreatmentList } from '@shared/components/treatments/list/list';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';
import { Clients } from '../../clients/clients';
import { Calendar } from '../calendar';
import { CalendarEntry } from '../calendar-entry';
import { timeOptions } from '../calendar-time-slots';
import { buildTreatmentSearch, findTreatmentByName } from '../treatment-catalog-search';
import {
    IComboBoxItem, buildEntryForm, buildEntryRequest, buildFormValue,
    buildRescheduleWarning, buildSearchForm, findTimeOption
} from './calendar-entry-form';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-calendar-entry-dialog',
    imports: [Autocomplete, ComboBox, Dialog, Input, ReactiveFormsModule, TreatmentList],
    templateUrl: './calendar-entry-dialog.html',
    styleUrl: './calendar-entry-dialog.scss'
})
export class CalendarEntryDialog {
    readonly saved = output<void>();
    readonly deleted = output<void>();
    private readonly dialog = viewChild.required(Dialog);
    private readonly calendarService = inject(Calendar);
    private readonly clientsService = inject(Clients);
    private readonly formBuilder = inject(NonNullableFormBuilder);
    protected readonly timeOptions = timeOptions;
    protected readonly editingEntry = signal<CalendarEntry | null>(null);
    protected readonly selectedStartTime = signal<IComboBoxItem | undefined>(undefined);
    protected readonly selectedEndTime = signal<IComboBoxItem | undefined>(undefined);
    protected readonly isLoading = signal(false);
    protected readonly form = buildEntryForm(this.formBuilder);
    protected readonly clientSearchForm = buildSearchForm(this.formBuilder);
    protected readonly treatmentSearchForm = buildSearchForm(this.formBuilder);
    protected readonly selectedTreatments = signal<string[]>([]);
    protected readonly searchTreatments = buildTreatmentSearch(this.selectedTreatments);
    protected readonly selectedTreatmentDefinitions = computed(() =>
        this.selectedTreatments().map(name =>
            findTreatmentByName(name) ?? new TreatmentDefinition({ title: name, name, duration: 0, price: 0 })));

    private readonly entryFormValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });
    protected readonly showRescheduleWarning = buildRescheduleWarning(this.editingEntry, this.entryFormValues);

    readonly open = (date?: string, startTime?: string, endTime?: string, entry?: CalendarEntry) => {
        this.editingEntry.set(entry ?? null);
        this.form.reset(buildFormValue(date, startTime, endTime, entry));
        this.clientSearchForm.reset();
        this.treatmentSearchForm.reset();
        this.selectedTreatments.set(entry?.treatments ?? []);
        this.selectedStartTime.set(findTimeOption(startTime ?? entry?.startTime));
        this.selectedEndTime.set(findTimeOption(endTime ?? entry?.endTime));
        this.dialog().open();
    };

    protected readonly searchClients = (query: string) => this.clientsService.searchByName(query);

    protected readonly onClientSelected = (item: IComboBoxItem) => {
        this.form.patchValue({ customerId: item.value });
    };

    protected readonly onTreatmentSelected = (item: IComboBoxItem) => {
        if (!this.selectedTreatments().includes(item.value)) {
            this.selectedTreatments.update(names => [...names, item.value]);
        }
        this.treatmentSearchForm.reset();
    };

    protected readonly removeTreatment = (name: string) =>
        this.selectedTreatments.update(names => names.filter(existing => existing !== name));

    protected readonly onSave = async() => {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.isLoading.set(true);
        try {
            const request = buildEntryRequest(this.form.getRawValue(), this.selectedTreatments());
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
