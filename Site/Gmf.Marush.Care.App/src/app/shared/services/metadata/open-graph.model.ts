import { Meta } from '@angular/platform-browser';
import { PageMetadata } from '@shared/components/page/base/page-metadata.model';
import { ILanguage } from '@shared/models/language.model';

export class OpenGraph {
    constructor(private readonly metadata: PageMetadata, private readonly predefinedLanguage: ILanguage,
        private readonly otherLanguages: ILanguage[], private readonly meta: Meta) {}

    readonly attach = () => {
        this.meta.updateTag({ property: 'og:title', content: this.metadata.getTitle() });
        this.meta.updateTag({ property: 'og:description', content: this.metadata.getDescription() });
        this.meta.updateTag({ property: 'og:url', content: this.metadata.localizedUrl(this.predefinedLanguage.value) });
        this.updateOpenGraphLocale(this.predefinedLanguage, this.otherLanguages);
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
