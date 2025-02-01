import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PageMetadata } from '@shared/components/page/base/page-metadata.model';
import Language from '@shared/models/language.model';
import { CanonicalUrl } from './canonical-url.model';
import { OpenGraph } from './open-graph.model';
import { StructuredData } from './structured-data.model';

@Injectable({
    providedIn: 'root'
})
export class PageMetadataService {
    constructor(@Inject(LOCALE_ID) protected readonly locale: string, @Inject(DOCUMENT)private document: Document,
      protected readonly meta: Meta, protected readonly title: Title) {}

    readonly attach = (metadata: PageMetadata) => {
        this.setBasic(metadata);

        const language = new Language();
        const predefinedLanguage = language.supportedLanguages.filter(supportedLanguage =>
            supportedLanguage.value === this.locale)[0];
        const otherLanguages = language.supportedLanguages.filter(supportedLanguage =>
                supportedLanguage.value !== predefinedLanguage.value);

        new OpenGraph(metadata, predefinedLanguage, otherLanguages, this.meta).attach();
        new CanonicalUrl(metadata, this.document, predefinedLanguage, otherLanguages).attach();
        new StructuredData(metadata, this.document, predefinedLanguage).attach();
    };

    private readonly setBasic = (metadata: PageMetadata) => {
        this.title.setTitle(metadata.getTitle());
        this.meta.updateTag({ name: 'description', content: metadata.getDescription() });
        this.meta.updateTag({ name: 'keywords', content: metadata.getKeywords() });
    };
}
