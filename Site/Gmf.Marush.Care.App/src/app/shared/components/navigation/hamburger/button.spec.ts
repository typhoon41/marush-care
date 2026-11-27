/* eslint-disable max-lines-per-function -- Characterization specs keep one describe per unit. */
import { ChangeDetectionStrategy, Component, reflectComponentType, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HamburgerButton } from './button';

// Binds the button the way menu.html does, plus a listener that records every change event the parent receives.
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-hamburger-host',
    imports: [HamburgerButton],
    template: '<marush-hamburger-button [(collapsed)]="collapsed" (collapsedChange)="record($event)" />'
})
class HamburgerHost {
    readonly collapsed = signal(false);
    readonly received: boolean[] = [];
    readonly record = (collapsed: boolean) => this.received.push(collapsed);
}

const renderButton = async() => {
    const fixture = TestBed.createComponent(HamburgerHost);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    return { fixture, host: fixture.componentInstance, button };
};

describe('HamburgerButton', () => {
    it('exposes one collapsedChange output: the explicit output shadows the model change output', () => {
        expect(reflectComponentType(HamburgerButton)?.outputs).toEqual([
            { propName: 'collapsedChange', templateName: 'collapsedChange' }
        ]);
    });

    it('emits from both the model and the explicit output on one click (two emitters fire today)', async() => {
        const fixture = TestBed.createComponent(HamburgerButton);
        const fromModel: boolean[] = [];
        const fromOutput: boolean[] = [];
        fixture.componentInstance.collapsed.subscribe(collapsed => fromModel.push(collapsed));
        fixture.componentInstance.collapsedChange.subscribe(collapsed => fromOutput.push(collapsed));
        await fixture.whenStable();

        (fixture.nativeElement as HTMLElement).querySelector('button')?.click();

        expect(fromModel).toEqual([true]);
        expect(fromOutput).toEqual([false, true]);
    });

    it('delivers collapsedChange to the parent ONCE on creation with the initial value (ngOnInit emit)', async() => {
        const { host, button } = await renderButton();

        expect(host.received).toEqual([false]);
        expect(button.classList.contains('crossed')).toBe(false);
    });

    it('delivers collapsedChange to the parent ONCE per click, opening then closing', async() => {
        const { fixture, host, button } = await renderButton();

        button.click();
        await fixture.whenStable();
        expect(host.received).toEqual([false, true]);
        expect(host.collapsed()).toBe(true);
        expect(button.classList.contains('crossed')).toBe(true);

        button.click();
        await fixture.whenStable();
        expect(host.received).toEqual([false, true, false]);
        expect(host.collapsed()).toBe(false);
    });

    it('delivers ONCE for Enter and prevents its default, and not at all for another key', async() => {
        const { fixture, host, button } = await renderButton();
        const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });

        button.dispatchEvent(enter);
        button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }));
        await fixture.whenStable();

        expect(host.received).toEqual([false, true]);
        expect(enter.defaultPrevented).toBe(true);
    });

    it('describes the action it will take in its label', async() => {
        const { fixture, button } = await renderButton();
        expect(button.ariaLabel).toBe('Otvori meni');

        button.click();
        await fixture.whenStable();
        expect(button.ariaLabel).toBe('Zatvori meni');
    });
});
