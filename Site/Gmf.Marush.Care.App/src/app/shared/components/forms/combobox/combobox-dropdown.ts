import { ElementRef, Injector, Signal, afterNextRender, computed, signal } from '@angular/core';
import { OutsidePointerWatch } from '../outside-pointer-watch';

const focusableTabIndex = 0;
const unfocusableTabIndex = -1;

/** Expansion state, outside-tap dismissal and option focus of a combo box dropdown. */
export class ComboBoxDropdown {
    private static readonly focusOn = (element: ElementRef<HTMLElement> | undefined) => element?.nativeElement.focus();

    private readonly isExpanded = signal(false);
    private readonly outsidePointer: OutsidePointerWatch;

    readonly expanded = this.isExpanded.asReadonly();
    readonly hidden = computed(() => !this.isExpanded());
    readonly optionTabIndex = computed(() => this.isExpanded() ? focusableTabIndex : unfocusableTabIndex);

    constructor(host: HTMLElement,
        private readonly elements: Signal<readonly ElementRef<HTMLLIElement>[]>,
        private readonly injector: Injector) {
        this.outsidePointer = new OutsidePointerWatch(host, this.collapse);
    }

    readonly expand = (selectedValue?: string) => {
        this.isExpanded.set(true);
        this.outsidePointer.start();
        // The options only become focusable once the expanded list has been rendered.
        afterNextRender(() => this.focusSelected(selectedValue), { injector: this.injector });
    };

    readonly collapse = () => {
        this.isExpanded.set(false);
        this.outsidePointer.stop();
    };

    readonly release = () => this.outsidePointer.stop();

    readonly focusPrevious = (index: number) => ComboBoxDropdown.focusOn(this.at(index - 1));

    readonly focusNext = (index: number) => ComboBoxDropdown.focusOn(this.at(index + 1));

    readonly holdsFocusOn = (target: HTMLElement, ids: readonly string[]): boolean => {
        const parent = target.parentElement;
        const [ownId, buttonId, containerId] = ids;
        return parent?.id === containerId || parent?.parentElement?.id === containerId
            || target.id === ownId || target.id === buttonId || target.id === containerId;
    };

    private readonly focusSelected = (selectedValue?: string) => {
        const options = this.elements();
        const selected = options.find(option =>
            (option.nativeElement.lastChild as HTMLElement).getAttribute('value') === selectedValue);
        ComboBoxDropdown.focusOn(selected ?? options[0]);
    };

    private readonly at = (index: number) => {
        const options = this.elements();
        return options[(index + options.length) % options.length];
    };
}
