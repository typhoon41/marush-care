import { ChangeDetectionStrategy, Component, inject, output, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from '@shared/components/dialog/dialog';
import { Calendar } from '../calendar';
import { CalendarNote } from '../models';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-calendar-notes-dialog',
    imports: [Dialog, ReactiveFormsModule],
    templateUrl: './calendar-notes-dialog.html',
    styleUrl: './calendar-notes-dialog.scss'
})
export class CalendarNotesDialog {
    readonly saved = output<void>();

    private readonly dialog = viewChild.required(Dialog);
    private readonly calendarService = inject(Calendar);
    private readonly fb = inject(FormBuilder);

    protected readonly noteType = signal<'Daily' | 'Weekly'>('Daily');
    protected readonly noteDate = signal('');
    protected readonly existingNoteId = signal<string | null>(null);
    protected readonly isLoading = signal(false);
    protected readonly content = this.fb.nonNullable.control('');

    readonly open = (date: string, type: 'Daily' | 'Weekly', existingNote?: CalendarNote) => {
        this.noteDate.set(date);
        this.noteType.set(type);
        this.existingNoteId.set(existingNote?.id ?? null);
        this.content.setValue(existingNote?.content ?? '');
        this.dialog().open();
    };

    protected readonly titleLabel = () =>
        this.noteType() === 'Daily'
            ? $localize`:@@calendar.notes.daily:Dnevne napomene`
            : $localize`:@@calendar.notes.weekly:Nedeljne napomene`;

    protected readonly onSave = async() => {
        this.isLoading.set(true);
        try {
            await this.calendarService.upsertNote({
                date: this.noteDate(),
                noteType: this.noteType(),
                content: this.content.value
            });
            this.dialog().dismiss();
            this.saved.emit();
        } finally {
            this.isLoading.set(false);
        }
    };

    protected readonly onDelete = async() => {
        const id = this.existingNoteId();
        if (!id)
{ return; }
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
