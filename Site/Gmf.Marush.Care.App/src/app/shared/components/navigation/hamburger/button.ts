import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, model, OnInit, output } from '@angular/core';
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

    private readonly buttonShrinked = $localize`:@@content.menu.open:Otvori meni`;
    private readonly buttonCollapsed = $localize`:@@content.menu.close:Zatvori meni`;
    protected readonly buttonDescription = computed(() => this.collapsed() ? this.buttonCollapsed : this.buttonShrinked);

    ngOnInit(): void {
        // No other signal/event to listen to, so OnInit needs to stay.
        this.emitEvent();
    }

    protected readonly toggle = (event?: OptionalKeyboardEvent) => {
        if (isAction(event)) {
            event?.preventDefault();
            this.collapsed.set(!this.collapsed());
            this.emitEvent();
        }
    };

    private readonly emitEvent = () => this.collapsedChange.emit(this.collapsed());
}
