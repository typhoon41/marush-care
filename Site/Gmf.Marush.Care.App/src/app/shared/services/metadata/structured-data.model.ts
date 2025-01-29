import { PageMetadata } from '@shared/components/page/base/page-metadata.model';

export class StructuredData {
    constructor(private readonly metadata: PageMetadata, private readonly document: Document) { }

    readonly attach = () => {
        const script = this.document.querySelectorAll('script[type="application/ld+json"]').item(0) as HTMLScriptElement;
        const numberOfSpaces = 2;
        script.text = JSON.stringify(this.metadata.getStructuredData(), null, numberOfSpaces);
    };
}
