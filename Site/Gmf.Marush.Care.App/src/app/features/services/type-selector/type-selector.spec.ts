/* eslint-disable max-lines-per-function -- Characterization specs keep one describe per unit. */
import { ChangeDetectionStrategy, Component, reflectComponentType, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SelectedService } from '@shared/models/services/treatments/types';
import { TypeSelector } from './type-selector';

// Binds the selector the way services-page.html does, plus a listener that records every change event the parent receives.
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-type-selector-host',
    imports: [TypeSelector],
    template: '<marush-services-type-selector [(selectedService)]="selected" (selectedServiceChange)="record($event)" />'
})
class TypeSelectorHost {
    readonly selected = signal<SelectedService>('');
    readonly received: SelectedService[] = [];
    readonly record = (service: SelectedService) => this.received.push(service);
}

const renderSelector = async() => {
    const fixture = TestBed.createComponent(TypeSelectorHost);
    await fixture.whenStable();
    const services = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.service-placeholder'));
    return { fixture, host: fixture.componentInstance, services };
};

describe('TypeSelector', () => {
    it('renders the four service groups in catalog order', async() => {
        const { services } = await renderSelector();

        expect(services.map(service => service.querySelector('h2')?.textContent)).toEqual([
            'Tretmani Lica', 'Kombinacije Tretmana', 'Obrve i Trepavice', 'Tretmani tela'
        ]);
    });

    it('exposes one selectedServiceChange output: the explicit output shadows the model change output', () => {
        expect(reflectComponentType(TypeSelector)?.outputs).toEqual([
            { propName: 'selectedServiceChange', templateName: 'selectedServiceChange' }
        ]);
    });

    it('emits from both the model and the explicit output on one click (two emitters fire today)', async() => {
        const fixture = TestBed.createComponent(TypeSelector);
        fixture.componentRef.setInput('selectedService', '');
        const fromModel: SelectedService[] = [];
        const fromOutput: SelectedService[] = [];
        fixture.componentInstance.selectedService.subscribe(service => fromModel.push(service));
        fixture.componentInstance.selectedServiceChange.subscribe(service => fromOutput.push(service));
        await fixture.whenStable();

        (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.service-placeholder')?.click();

        expect(fromModel).toEqual(['face']);
        expect(fromOutput).toEqual(['face']);
    });

    it('delivers selectedServiceChange to the parent ONCE per click and nothing on creation', async() => {
        const { fixture, host, services } = await renderSelector();
        expect(host.received).toEqual([]);

        services[0].click();
        await fixture.whenStable();

        expect(host.received).toEqual(['face']);
        expect(host.selected()).toBe('face');
        expect(services[0].classList.contains('active')).toBe(true);
    });

    it('delivers ONCE again when the selected group is clicked to deselect it', async() => {
        const { fixture, host, services } = await renderSelector();
        services[0].click();
        await fixture.whenStable();

        services[0].click();
        await fixture.whenStable();

        expect(host.received).toEqual(['face', '']);
        expect(host.selected()).toBe('');
    });

    it('delivers ONCE for Enter or Space and not at all for another key', async() => {
        const { fixture, host, services } = await renderSelector();

        services[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        services[2].dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        services[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        await fixture.whenStable();

        expect(host.received).toEqual(['combination', 'browsLashes']);
        expect(host.selected()).toBe('browsLashes');
    });
});
