import { PageMetadata } from '@shared/components/page/base/page-metadata.model';
import { ILanguage } from '@shared/models/language.model';

export class CanonicalUrl {
    constructor(private readonly metadata: PageMetadata, private readonly document: Document,
        private readonly predefinedLanguage: ILanguage, private readonly otherLanguages: ILanguage[]) { }

    readonly attach = () => {
        const canonicalUrl = this.document.querySelectorAll('link[rel="canonical"]').item(0) as HTMLLinkElement;

        if (canonicalUrl) {
            canonicalUrl.href = this.metadata.localizedPageUrl(this.predefinedLanguage.value);
        }

        const alternateUrls = this.document.querySelectorAll('link[rel="alternate"]:not([hreflang="x-default"])');

        alternateUrls.forEach((alternateUrl, currentIndex) => {
            const alternateLink = alternateUrl as HTMLLinkElement;
            const currentLanguage = this.otherLanguages[currentIndex].value;
            alternateLink.href = this.metadata.localizedPageUrl(currentLanguage);
            alternateLink.hreflang = currentLanguage;
        });
    };
}
