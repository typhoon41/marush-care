import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Input } from '@shared/components/forms/input/input';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-clients-edit-page',
    imports: [Input, ReactiveFormsModule],
    templateUrl: './clients-edit-page.html',
    styleUrl: './clients-edit-page.scss'
})
export class ClientsEditPage {
    private readonly formBuilder = inject(FormBuilder);
    private readonly title = inject(Title);
    protected readonly form = this.formBuilder.group({
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            name: new FormControl('', [Validators.maxLength(25)])
        }, { updateOn: 'change' });

        constructor() {
            this.title.setTitle('Marush: Space of Care - izmena klijenta');
        }

    protected readonly onSubmit = () => {
        if (this.form.invalid) {
            return;
        }

        const name = this.form.get('name')?.value as string;
        // eslint-disable-next-line no-console
        console.log('Submitted name:', name);
        // This.clients.data().filter.set(name ?? '');
    };
}
