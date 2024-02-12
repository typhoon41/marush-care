import { environment } from '@env';
import { StorageService } from '../services/storage.service';

export interface ILanguage {
    description: 'SRB' | 'ENG' | 'RUS';
    value: 'sr' | 'en' | 'ru';
}

export default class Language {
    private readonly initial = 'sr';
    private readonly languageKey = 'language';
    private readonly storage = new StorageService();

    readonly supportedLanguages: ILanguage[] = [{ description: 'SRB', value: 'sr' },
    { description: 'ENG', value: 'en' },
    { description: 'RUS', value: 'ru' }];

    readonly isPredefined = () => this.storedLanguage() === this.urlLanguage();
    readonly changeTo = (language: ILanguage) => {
        this.storage.save(this.languageKey, language.value);
        // eslint-disable-next-line xss/no-location-href-assign
        window.location.href = `${environment.url}${language.value}`;
    };

    readonly default = this.supportedLanguages.filter(language =>
        language.value === this.initial)[0];

    readonly predefined = () => this.supportedLanguages.filter(language =>
        language.value === this.storedLanguage())[0] ?? this.default.value;

    private readonly storedLanguage = () => this.storage.load(this.languageKey) ?? this.default.value;
    private readonly urlLanguage = () => window.location.pathname.split('/')[1] ?? this.default.value;
}
