import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { InputComponent } from '@shared/components/forms/input/input.component';
import { TableMetadata } from '@shared/components/pagination/table/table-metadata.model';
import { MarushTablePaginationComponent } from '@shared/components/pagination/table/table-pagination.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-login-page',
    imports: [MarushTablePaginationComponent, InputComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './clients-page.component.html',
    styleUrl: './clients-page.component.scss'
})
export class ClientsPageComponent implements OnInit {
    form: FormGroup;
    defaultFieldLength = 100;

    constructor(private readonly title: Title, private readonly formBuilder: FormBuilder) {
        this.title.setTitle('Marush: Space of Care - klijenti');
        this.form = this.formBuilder.group({
            name: new FormControl('', [Validators.maxLength(this.defaultFieldLength)])
        }, { updateOn: 'blur' });
    }

    tableContent: { id: string; name: string; contact: string }[] = [];
    tableMetadata = {
        columns: [{ name: 'Id', displayName: 'Id', hidden: true, sortable: false },
        { name: 'name', displayName: 'Ime i prezime', hidden: false, sortable: true, className: 'column-6' },
        { name: 'contact', displayName: 'Kontakt', hidden: false, sortable: false, className: 'column-6' }
        ],
        sortedBy: 'name',
        sortedDirection: 'asc'
    } as TableMetadata;

    ngOnInit() {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let index = 0; index < 1000; index++) {
            this.tableContent.push({
                id: `${index + 1}`,
                contact: `contact-${index + 1}`,
                name: `row-${index + 1}`
            });
        }
    }

    readonly onSubmit = () => {
        // Handle form submission
    };
}
