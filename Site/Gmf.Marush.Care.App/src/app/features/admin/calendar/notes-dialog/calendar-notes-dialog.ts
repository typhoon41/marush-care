import { ChangeDetectionStrategy, Component, inject, output, signal, viewChild } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from '@shared/components/dialog/dialog';
import { DialogOperation } from '@shared/components/dialog/dialog-operation';
import { Input } from '@shared/components/forms/input/input';
import { Calendar } from '../calendar';
import { CalendarNote } from '../calendar-note';
import { CalendarNoteType } from '../calendar-note-type';
import { toSerbianDate } from '../calendar-week-navigator';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-calendar-notes-dialog',
    imports: [Dialog, Input, ReactiveFormsModule],
    templateUrl: './calendar-notes-dialog.html',
    styleUrl: './calendar-notes-dialog.scss'
})
export class CalendarNotesDialog {
    readonly saved = output<void>();

    private readonly dialog = viewChild.required(Dialog);
    private readonly calendarService = inject(Calendar);
    private readonly formBuilder = inject(NonNullableFormBuilder);

    protected readonly noteType = signal<CalendarNoteType>('Daily');
    protected readonly noteDate = signal('');
    protected readonly existingNoteId = signal<string | null>(null);
    protected readonly operation = new DialogOperation();
    protected readonly noteForm = this.formBuilder.group({
        content: new FormControl('', { nonNullable: true })
    });

    readonly open = (date: string, type: CalendarNoteType, existingNote?: CalendarNote) => {
        this.noteDate.set(date);
        this.noteType.set(type);
        this.existingNoteId.set(existingNote?.id ?? null);
        this.noteForm.controls.content.setValue(existingNote?.content ?? '');
        this.operation.reset();
        this.dialog().open();
    };

    protected readonly titleLabel = () =>
        this.noteType() === 'Daily' ? 'Dnevne napomene' : 'Nedeljne napomene';

    protected readonly onSave = async() => {
        await this.complete(() => this.calendarService.upsertNote({
            date: toSerbianDate(this.noteDate()),
            noteType: this.noteType(),
            content: this.noteForm.getRawValue().content
        }));
    };

    protected readonly onDelete = async() => {
        const id = this.existingNoteId();
        if (!id) {
            return;
        }
        await this.complete(() => this.calendarService.deleteNote(id));
    };

    private readonly complete = async(action: () => Promise<void>) => {
        if (await this.operation.run(action)) {
            this.dialog().dismiss();
            this.saved.emit();
        }
    };
}
