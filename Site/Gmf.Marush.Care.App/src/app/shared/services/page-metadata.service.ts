import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env';
import { PageMetadata } from '@shared/components/page/base/page-metadata.model';
import Language, { ILanguage } from '@shared/models/language.model';

@Injectable({
    providedIn: 'root'
})
export class PageMetadataService {
    constructor(@Inject(LOCALE_ID) protected readonly locale: string, @Inject(DOCUMENT)private document: Document,
      protected readonly meta: Meta, protected readonly title: Title) {}

    readonly attach = (metadata: PageMetadata) => {
        this.meta.updateTag({ name: 'description', content: metadata.getDescription() });
        this.meta.updateTag({ name: 'keywords', content: metadata.getKeywords() });
        const language = new Language();
        const predefinedLanguage = language.supportedLanguages.filter(supportedLanguage =>
            supportedLanguage.value === this.locale)[0];
        const otherLanguages = language.supportedLanguages.filter(supportedLanguage =>
                supportedLanguage.value !== predefinedLanguage.value);

        this.updateOpenGraph(metadata, predefinedLanguage, otherLanguages);
        this.updateCanonicalUrls(metadata, predefinedLanguage, otherLanguages);
        this.title.setTitle(metadata.getTitle());
    };

    private readonly currentUrl = (predefinedLanguage: ILanguage, metadata: PageMetadata) =>
        `${environment.url + predefinedLanguage.value}/${metadata.pathTranslations()[predefinedLanguage.value]}`;

    private readonly updateCanonicalUrls = (metadata: PageMetadata, predefinedLanguage: ILanguage, otherLanguages: ILanguage[]) => {
        const canonicalUrl = this.document.querySelectorAll('link[rel="canonical"]').item(0) as HTMLLinkElement;

        if (canonicalUrl) {
            canonicalUrl.href = this.currentUrl(predefinedLanguage, metadata);
        }

        const alternateUrls = this.document.querySelectorAll('link[rel="alternate"]:not([hreflang="x-default"])');

        alternateUrls.forEach((alternateUrl, currentIndex) => {
            const alternateLink = alternateUrl as HTMLLinkElement;
            const currentLanguage = otherLanguages[currentIndex].value;
            alternateLink.href = `${environment.url + currentLanguage}/${metadata.pathTranslations()[currentLanguage]}`;
            alternateLink.hreflang = currentLanguage;
        });
    };

    private readonly updateOpenGraph = (metadata: PageMetadata, predefinedLanguage: ILanguage, otherLanguages: ILanguage[]) => {
        this.meta.updateTag({ property: 'og:title', content: metadata.getTitle() });
        this.meta.updateTag({ property: 'og:description', content: metadata.getDescription() });
        this.meta.updateTag({ property: 'og:url', content: this.currentUrl(predefinedLanguage, metadata) });
        this.updateOpenGraphLocale(predefinedLanguage, otherLanguages);
    };

    private readonly updateOpenGraphLocale = (predefinedLanguage: ILanguage, otherLanguages: ILanguage[]) => {
        this.meta.updateTag({ property: 'og:locale', content: predefinedLanguage.iso });

        // Duplicate tags must be removed before adding new ones.
        otherLanguages.forEach(_ => {
            this.meta.removeTag('property="og:locale:alternate"');
        });

        otherLanguages.forEach((otherLanguage, index) => {
            // After adding the first one, the tag must be added without duplication check (index > 0).
            this.meta.addTag({ property: 'og:locale:alternate', content: otherLanguage.iso }, index > 0);
        });
    };
}
