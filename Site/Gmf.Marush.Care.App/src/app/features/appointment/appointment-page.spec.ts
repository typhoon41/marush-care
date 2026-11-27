/* eslint-disable @typescript-eslint/no-magic-numbers -- Characterization specs pin literal legacy values. */
import { provideHttpClient } from '@angular/common/http';
import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import supportedFaceTreatments from '@shared/models/services/treatments/definitions/face-treatments';
import { TreatmentDefinition } from '@shared/models/services/treatments/treatment-definition';
import { AppointmentPage } from './appointment-page';

// The page keeps its selection handlers and total protected for its template; the specs drive them the same way.
interface AppointmentPageSelection {
    totalCost: Signal<number>;
    onToggleSelection: (item: TreatmentDefinition, checked: boolean) => void;
    onRemoveSelection: (item: TreatmentDefinition) => void;
}

const treatment = (name: string) => {
    const found = supportedFaceTreatments.find(definition => definition.name === name);
    if (!found) {
        throw new Error(`The face catalog no longer has "${name}".`);
    }
    return found;
};

const classic = treatment('Klasičan higijenski tretman');
const dermapen = treatment('Dermapen');

// Stapler writes page metadata into the structured-data script that index.html ships.
const addIndexStructuredData = () => {
    if (!document.head.querySelector('script[type="application/ld+json"]')) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }
};

const createPage = () => {
    addIndexStructuredData();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
    return TestBed.createComponent(AppointmentPage).componentInstance as unknown as AppointmentPageSelection;
};

describe('AppointmentPage booking total', () => {
    it('RULE-001 starts at 0 with nothing selected', () => {
        expect(createPage().totalCost()).toBe(0);
    });

    it('RULE-001 sums the catalog prices of the ticked treatments (3,500 + 6,500 = 10,000)', () => {
        const page = createPage();

        page.onToggleSelection(classic, true);
        page.onToggleSelection(dermapen, true);

        expect(page.totalCost()).toBe(10000);
    });

    it('RULE-001 drops the price of an unticked or removed treatment', () => {
        const page = createPage();
        page.onToggleSelection(classic, true);
        page.onToggleSelection(dermapen, true);

        page.onToggleSelection(classic, false);
        expect(page.totalCost()).toBe(6500);

        page.onRemoveSelection(dermapen);
        expect(page.totalCost()).toBe(0);
    });

    it('RULE-001 does not block ticking the same treatment twice', () => {
        const page = createPage();

        page.onToggleSelection(dermapen, true);
        page.onToggleSelection(dermapen, true);

        expect(page.totalCost()).toBe(13000);
    });
});
