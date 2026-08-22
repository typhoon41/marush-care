import { ChangeDetectionStrategy, Component, computed, inject, output, signal, viewChild } from '@angular/core';
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
import { EntryDialogForm } from './entry-dialog-form';

const newEntryTitle = 'Novi termin';
const existingEntryTitle = 'Termin';

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

    protected readonly editingEntry = signal<CalendarEntry | null>(null);
    protected readonly isEditing = computed(() => this.editingEntry() !== null);
    protected readonly title = computed(() => this.isEditing() ? existingEntryTitle : newEntryTitle);
    protected readonly operation = new DialogOperation();
    protected readonly entryForm = new EntryDialogForm(
        inject(NonNullableFormBuilder), inject(Clients), this.editingEntry);

    readonly open = (selection?: CalendarSelection, entry?: CalendarEntry) => {
        this.editingEntry.set(entry ?? null);
        this.entryForm.reset(selection, entry);
        this.operation.reset();
        this.dialog().open();
    };

    protected readonly onSave = async() => {
        if (!this.entryForm.acceptsSave()) {
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
        const request = this.entryForm.toRequest();
        const entry = this.editingEntry();
        return entry ? this.calendarService.updateEntry(entry.id, request) : this.calendarService.createEntry(request);
    };
}
