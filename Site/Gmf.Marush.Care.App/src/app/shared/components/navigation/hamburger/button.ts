import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, model, OnInit, output } from '@angular/core';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-hamburger-button',
    imports: [CommonModule],
    templateUrl: './button.html',
    styleUrl: './button.scss'
})
export class HamburgerButton implements OnInit {
    readonly collapsed = model<boolean>(false);
    readonly collapsedChange = output<boolean>();

    protected buttonDescription: string = '';
    private readonly buttonShrinked = $localize`:@@content.menu.open:Otvori meni`;
    private readonly buttonCollapsed = $localize`:@@content.menu.close:Zatvori meni`;

    ngOnInit(): void {
        // No other signal/event to listen to, so OnInit needs to stay.
        this.emitEvent();
        this.setButtonDescription();
    }

    protected readonly toggle = (event?: OptionalKeyboardEvent) => {
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
