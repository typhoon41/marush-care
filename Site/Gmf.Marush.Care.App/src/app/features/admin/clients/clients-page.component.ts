import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, HostBinding, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { InputComponent } from '@shared/components/forms/input/input.component';
import { PaginatedResponse, TableMetadata } from '@shared/components/pagination/table/table-metadata.model';
import { MarushTablePaginationComponent } from '@shared/components/pagination/table/table-pagination.component';
import { ClientService } from './clients-service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-clients-page',
    imports: [MarushTablePaginationComponent, InputComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './clients-page.component.html',
    styleUrl: './clients-page.component.scss'
})
export class ClientsPageComponent {
    form: FormGroup;
    defaultFieldLength = 100;
    private readonly clientService = inject(ClientService);
    customersList = this.clientService.getCustomers();
    @HostBinding('class') classAttribute: string = 'clients-page';

    constructor(private readonly title: Title, private readonly formBuilder: FormBuilder
    ) {
        this.title.setTitle('Marush: Space of Care - klijenti');
        this.form = this.formBuilder.group({
            name: new FormControl('', [Validators.maxLength(this.defaultFieldLength)])
        }, { updateOn: 'change' });
        this.customersList.reload();
    }

    readonly tableContent = computed(() => this.customersList.hasValue() ? this.customersList.value() :
        { items: [] } as unknown as PaginatedResponse);

    tableMetadata = {
        columns: [{ name: 'id', displayName: 'Id', hidden: true, sortable: false },
        { name: 'fullName', displayName: 'Ime i prezime', hidden: false, sortable: true, className: 'column-6' },
        { name: 'contactNumber', displayName: 'Kontakt', hidden: false, sortable: false, className: 'column-6' }
        ],
        state: this.clientService.data
    } as TableMetadata;

    readonly onSubmit = () => {
        if (this.form.invalid) {
            return;
        }

        const name = this.form.get('name')?.value as string;
        this.clientService.data().filter.set(name ?? '');
    };
}
