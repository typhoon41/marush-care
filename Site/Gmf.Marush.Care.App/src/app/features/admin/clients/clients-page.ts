import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Input } from '@shared/components/forms/input/input';
import { PaginatedResponse, TableMetadata } from '@shared/components/pagination/table/table-metadata';
import { TablePagination } from '@shared/components/pagination/table/table-pagination';
import { Clients } from './clients';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-clients-page',
    imports: [TablePagination, Input, ReactiveFormsModule, CommonModule],
    templateUrl: './clients-page.html',
    styleUrl: './clients-page.scss',
    host: { class: 'clients-page' }
})
export class ClientsPage {
    form: FormGroup;
    defaultFieldLength = 100;
    private readonly clients = inject(Clients);
    private readonly router = inject(Router);
    retrievedClients = this.clients.getAll();

    constructor(private readonly title: Title, private readonly formBuilder: FormBuilder) {
        this.title.setTitle('Marush: Space of Care - klijenti');
        this.form = this.formBuilder.group({
            name: new FormControl('', [Validators.maxLength(this.defaultFieldLength)])
        }, { updateOn: 'change' });
        this.retrievedClients.reload();
    }

    protected readonly tableContent = computed(() => this.retrievedClients.hasValue() ? this.retrievedClients.value() :
        { items: [] } as unknown as PaginatedResponse);

    protected readonly tableMetadata = {
        columns: [{ name: 'id', displayName: 'Id', hidden: true, sortable: false },
        { name: 'fullName', displayName: 'Ime i prezime', hidden: false, sortable: true, className: 'column-6' },
        { name: 'contactNumber', displayName: 'Kontakt', hidden: false, sortable: false, className: 'column-6' }
        ],
        state: this.clients.data,
        onRowClick: async(id: string) => {
            await this.router.navigate(['/admin/klijent', id]);
        }

    } as TableMetadata;

    protected readonly onSubmit = () => {
        if (this.form.invalid) {
            return;
        }

        const name = this.form.get('name')?.value as string;
        this.clients.data().filter.set(name ?? '');
    };
}
