import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@env';
import Language, { ILanguage } from '@shared/models/language.model';

export abstract class PageMetadata {
    constructor(protected readonly locale: string,
        protected readonly router: Router, protected readonly meta: Meta, protected readonly title: Title) { }

    abstract getTitle: () => string;
    abstract getDescription: () => string;
    abstract getKeywords: () => string;

    readonly attachMetadata = () => {
        this.meta.updateTag({ name: 'description', content: this.getDescription() });
        this.meta.updateTag({ name: 'keywords', content: this.getKeywords() });
        this.updateOpenGraphMetadata();
        this.title.setTitle(this.getTitle());
    };

    private readonly updateOpenGraphMetadata = () => {
        this.meta.updateTag({ property: 'og:title', content: this.getTitle() });
        this.meta.updateTag({ property: 'og:description', content: this.getDescription() });
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const language = new Language();
        const predefinedLanguage = language.supportedLanguages.filter(supportedLanguage =>
            supportedLanguage.value === this.locale)[0];
        this.meta.updateTag({ property: 'og:url', content: environment.url + predefinedLanguage.value + this.router.url });

        this.updateOpenGraphLocale(language, predefinedLanguage);
    };

    private readonly updateOpenGraphLocale = (language: Language, predefinedLanguage: ILanguage) => {
        this.meta.updateTag({ property: 'og:locale', content: predefinedLanguage.iso });
        const otherLanguages = language.supportedLanguages.filter(supportedLanguage =>
            supportedLanguage.value !== predefinedLanguage.value);

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
