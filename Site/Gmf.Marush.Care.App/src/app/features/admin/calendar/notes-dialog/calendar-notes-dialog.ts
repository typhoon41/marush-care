import { ChangeDetectionStrategy, Component, inject, output, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from '@shared/components/dialog/dialog';
import { Input } from '@shared/components/forms/input/input';
import { Calendar } from '../calendar';
import { CalendarNote } from '../calendar-note';
import { CalendarNoteType } from '../calendar-note-type';
import { toSerbianDate } from '../entry-dialog/calendar-entry-form';

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
    private readonly formBuilder = inject(FormBuilder);

    protected readonly noteType = signal<CalendarNoteType>('Daily');
    protected readonly noteDate = signal('');
    protected readonly existingNoteId = signal<string | null>(null);
    protected readonly isLoading = signal(false);
    protected readonly noteForm: FormGroup = this.formBuilder.nonNullable.group({ content: [''] });

    readonly open = (date: string, type: CalendarNoteType, existingNote?: CalendarNote) => {
        this.noteDate.set(date);
        this.noteType.set(type);
        this.existingNoteId.set(existingNote?.id ?? null);
        this.noteForm.controls['content'].setValue(existingNote?.content ?? '');
        this.dialog().open();
    };

    protected readonly titleLabel = () =>
        this.noteType() === 'Daily' ? 'Dnevne napomene' : 'Nedeljne napomene';

    protected readonly onSave = async() => {
        this.isLoading.set(true);
        try {
            await this.calendarService.upsertNote({
                date: toSerbianDate(this.noteDate()),
                noteType: this.noteType(),
                content: this.noteForm.value.content as string
            });
            this.dialog().dismiss();
            this.saved.emit();
        } finally {
            this.isLoading.set(false);
        }
    };

    protected readonly onDelete = async() => {
        const id = this.existingNoteId();
        if (!id) {
            return;
        }
        this.isLoading.set(true);
        try {
            await this.calendarService.deleteNote(id);
            this.dialog().dismiss();
            this.saved.emit();
        } finally {
            this.isLoading.set(false);
        }
    };
}
