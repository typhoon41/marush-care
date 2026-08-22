import { ElementRef, Signal } from '@angular/core';
import { OutsidePointerWatch } from '../outside-pointer-watch';

const focusOn = (element: ElementRef<HTMLElement> | undefined) => element?.nativeElement.focus();

/** Expansion state, outside-tap dismissal and option focus of a combo box dropdown. */
export class ComboBoxDropdown {
    private readonly outsidePointer: OutsidePointerWatch;
    private isExpanded = false;

    constructor(host: HTMLElement,
        private readonly elements: Signal<readonly ElementRef<HTMLLIElement>[]>,
        private readonly onDismissed: () => void) {
        this.outsidePointer = new OutsidePointerWatch(host, this.dismiss);
    }

    get expanded(): boolean {
        return this.isExpanded;
    }

    readonly expand = () => {
        this.isExpanded = true;
        this.outsidePointer.start();
    };

    readonly collapse = () => {
        this.isExpanded = false;
        this.outsidePointer.stop();
    };

    readonly release = () => this.outsidePointer.stop();

    readonly focusSelected = (selectedValue?: string) => {
        const options = this.elements();
        const selected = options.find(option =>
            (option.nativeElement.lastChild as HTMLElement).getAttribute('value') === selectedValue);
        focusOn(selected ?? options[0]);
    };

    readonly focusPrevious = (index: number) => focusOn(this.at(index - 1));

    readonly focusNext = (index: number) => focusOn(this.at(index + 1));

    readonly holdsFocusOn = (target: HTMLElement, ids: readonly string[]): boolean => {
        const parent = target.parentElement;
        const [ownId, buttonId, containerId] = ids;
        return parent?.id === containerId || parent?.parentElement?.id === containerId
            || target.id === ownId || target.id === buttonId || target.id === containerId;
    };

    private readonly at = (index: number) => {
        const options = this.elements();
        return options[(index + options.length) % options.length];
    };

    private readonly dismiss = () => {
        this.collapse();
        this.onDismissed();
    };
}
