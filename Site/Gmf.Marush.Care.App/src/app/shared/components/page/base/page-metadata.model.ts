import { SupportedLanguage } from '@shared/models/language.model';

export abstract class PageMetadata {
    abstract getTitle: () => string;
    abstract getDescription: () => string;
    abstract getKeywords: () => string;
    abstract pathTranslations: () => Record<SupportedLanguage, string>;
}
