import { environment } from '@env';
import { CookieStorage } from './cookie-storage.model';

export interface ILanguage {
    description: 'SRB' | 'ENG' | 'RUS';
    value: 'sr' | 'en' | 'ru';
}

export default class Language {
    private readonly initial = 'sr';
    private readonly languageKey = 'language';
    private readonly storage = new CookieStorage();

    readonly supportedLanguages: ILanguage[] = [{ description: 'SRB', value: 'sr' },
    { description: 'ENG', value: 'en' },
    { description: 'RUS', value: 'ru' }];

    readonly setup = () => {
        let urlLanguage = this.urlLanguage();
        if (this.supportedLanguages.every(language => language.value !== urlLanguage)) {
            urlLanguage = this.default.value;
        }

        if (this.storedLanguage() !== urlLanguage) {
            this.save(urlLanguage);
        }
    };

    readonly changeTo = (language: ILanguage) => {
        this.save(language.value);
        location.replace(`${environment.url}${language.value}/`);
    };

    readonly default = this.supportedLanguages.filter(language =>
        language.value === this.initial)[0];

    readonly predefined = () => this.supportedLanguages.filter(language =>
        language.value === (this.storedLanguage() ?? this.default.value))[0] ?? this.default.value;

    private readonly storedLanguage = () => this.storage.load(this.languageKey);
    private readonly urlLanguage = () => window.location.pathname.split('/')[1] ?? this.default.value;
    private readonly save = (language: string) => this.storage.save(this.languageKey, language);
}
