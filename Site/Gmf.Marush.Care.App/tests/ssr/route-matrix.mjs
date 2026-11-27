import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Every public and admin route the built server answers, derived from the sources so a route change shows up as a diff.
export class RouteMatrix {
    static hosts = ['localhost', 'marushcare.com', 'test.marushcare.com', 'evil.example'];
    static rootLanguages = ['', 'en', 'ru'];
    static unknownPath = 'nepostojeca-stranica';
    static sampleClientId = '1';

    constructor(appRoot) {
        this.appRoot = appRoot;
    }

    requests = () => {
        const requests = [];
        for (const host of RouteMatrix.hosts) {
            for (const acceptLanguage of RouteMatrix.rootLanguages) {
                requests.push({ host, path: '/', acceptLanguage, route: 'root' });
            }
            for (const locale of this.locales()) {
                for (const { route, path } of this.localizedPaths(locale)) {
                    requests.push({ host, path: `/${locale}/${path}`, acceptLanguage: '', route });
                }
            }
        }
        return requests;
    };

    locales = () => {
        const { i18n } = this.readJson('angular.json').projects.marush;
        return [i18n.sourceLocale, ...Object.keys(i18n.locales)];
    };

    localizedPaths = (locale) => {
        const messages = this.messagesOf(locale);
        const routes = [{ route: 'locale-root', path: '' }];
        for (const { key, messageId, literal } of this.declaredRoutes()) {
            const path = literal ?? messages[messageId];
            if (path === undefined) {
                throw new Error(`Route "${key}" uses message "${messageId}", missing from the ${locale} locale file.`);
            }
            routes.push({ route: key, path: path.replace(':id', RouteMatrix.sampleClientId) });
        }
        for (const errorType of this.errorTypes(messages)) {
            routes.push({ route: `error/${errorType}`, path: `${messages['routes.error']}/${messages[`routes.error.${errorType}`]}` });
        }
        routes.push({ route: 'unknown', path: RouteMatrix.unknownPath });
        return routes;
    };

    declaredRoutes = () => {
        const directory = join(this.appRoot, 'src', 'app', 'shared', 'routes');
        const sources = ['routes.ts', 'appointment-routes.ts', 'admin-routes.ts']
            .map(file => readFileSync(join(directory, file), 'utf8')).join('\n');
        const declarations = [...sources.matchAll(/lazyRoute\('([^']+)',\s*(?:'([^']+)'|\$localize`:@@([^:]+):[^`]*`|this\.home\(\))/gu)];
        if (declarations.length === 0) {
            throw new Error('No lazyRoute declarations found; the route sources changed shape.');
        }
        return declarations.map(([, key, literal, messageId]) => ({
            key,
            literal,
            messageId: literal ? undefined : messageId ?? 'routes.home'
        }));
    };

    errorTypes = (messages) => Object.keys(messages)
        .filter(id => /^routes\.error\.[a-z-]+$/u.test(id))
        .map(id => id.substring('routes.error.'.length))
        .sort();

    messagesOf = (locale) => {
        const file = locale === this.locales()[0] ? 'messages.json' : `messages.${locale}.json`;
        return this.readJson(join('src', 'locale', file)).translations;
    };

    readJson = (relativePath) => JSON.parse(readFileSync(join(this.appRoot, relativePath), 'utf8'));
}
