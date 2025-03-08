import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, model, OnInit, output } from '@angular/core';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-hamburger-button',
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class HamburgerButtonComponent implements OnInit {
    readonly collapsed = model<boolean>(false);
    readonly collapsedChange = output<boolean>();

    private readonly buttonShrinked = $localize`:@@content.menu.open:Otvori meni`;
    private readonly buttonCollapsed = $localize`:@@content.menu.close:Zatvori meni`;
    buttonDescription: string = '';

    ngOnInit(): void {
        this.emitEvent();
        this.setButtonDescription();
    }

    readonly toggle = (event?: OptionalKeyboardEvent) => {
        if (isAction(event)) {
            event?.preventDefault();
            this.collapsed.set(!this.collapsed());
            this.setButtonDescription();
            this.emitEvent();
        }
    };

    private readonly emitEvent = () => this.collapsedChange.emit(this.collapsed());
    private readonly setButtonDescription = () => {
        this.buttonDescription = this.collapsed() ? this.buttonCollapsed : this.buttonShrinked;
    };
}
