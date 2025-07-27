import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MarushTablePaginationComponent } from '@shared/components/pagination/table/table-pagination.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-login-page',
    imports: [MarushTablePaginationComponent, CommonModule],
    templateUrl: './clients-page.component.html',
    styleUrl: './clients-page.component.scss'
})
export class ClientsPageComponent implements OnInit {
    constructor(private readonly title: Title) {
        this.title.setTitle('Marush: Space of Care - klijenti');
    }

    tableContent: { name: string }[] = [];

    ngOnInit() {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let index = 0; index < 1000; index++) {
            this.tableContent.push({
                name: `row-${index + 1}`
            });
        }
    }
}
