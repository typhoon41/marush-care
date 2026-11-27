import { request } from 'node:http';

// One request to the running server and the SEO-relevant facts of its answer.
export class PageSnapshot {
    static requestTimeout = 30000;

    static capture = (port, { host, path, acceptLanguage }) => new Promise((resolve, reject) => {
        const headers = { host };
        if (acceptLanguage) {
            headers['accept-language'] = acceptLanguage;
        }
        const call = request({ host: '127.0.0.1', port, path: encodeURI(path), headers, timeout: PageSnapshot.requestTimeout },
            response => {
                const chunks = [];
                response.on('data', chunk => chunks.push(chunk));
                response.on('end', () => resolve(PageSnapshot.of(response, Buffer.concat(chunks).toString('utf8'))));
                response.on('error', reject);
            });
        call.on('timeout', () => call.destroy(new Error(`${host} ${path} timed out`)));
        call.on('error', reject);
        call.end();
    });

    static of = (response, body) => {
        const html = /html/u.test(response.headers['content-type'] ?? '');
        return {
            status: response.statusCode,
            location: PageSnapshot.decodedLocation(response.headers.location),
            contentType: (response.headers['content-type'] ?? null),
            lang: html ? PageSnapshot.attribute(/<html\b[^>]*>/u, 'lang', body) : null,
            title: html ? PageSnapshot.text(/<title[^>]*>([\s\S]*?)<\/title>/u, body) : null,
            description: html ? PageSnapshot.tagAttribute('meta', { name: 'description' }, 'content', body) : null,
            canonical: html ? PageSnapshot.tagAttribute('link', { rel: 'canonical' }, 'href', body) : null,
            h1: html ? PageSnapshot.text(/<h1\b[^>]*>([\s\S]*?)<\/h1>/u, body) : null,
            serverContext: html ? PageSnapshot.attribute(/<[a-z-]+\b[^>]*\bng-server-context="[^"]*"[^>]*>/u, 'ng-server-context', body) : null,
            serverRendered: body.includes('ng-server-context="ssr"')
        };
    };

    static decodedLocation = (location) => {
        if (!location) {
            return null;
        }
        try {
            return decodeURI(location);
        } catch {
            return location;
        }
    };

    static attribute = (tagPattern, name, body) => {
        const tag = body.match(tagPattern)?.[0];
        return tag ? PageSnapshot.attributesOf(tag)[name] ?? null : null;
    };

    static tagAttribute = (tagName, required, name, body) => {
        for (const [tag] of body.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gu'))) {
            const attributes = PageSnapshot.attributesOf(tag);
            if (Object.entries(required).every(([key, value]) => attributes[key] === value)) {
                return attributes[name] ?? null;
            }
        }
        return null;
    };

    static attributesOf = (tag) => Object.fromEntries(
        [...tag.matchAll(/([\w:-]+)="([^"]*)"/gu)].map(([, key, value]) => [key, PageSnapshot.decoded(value)]));

    static text = (pattern, body) => {
        const match = body.match(pattern);
        return match ? PageSnapshot.decoded(match[1].replace(/<[^>]+>/gu, ' ')).replace(/\s+/gu, ' ').trim() : null;
    };

    static decoded = (value) => value
        .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)))
        .replace(/&#x([\da-f]+);/giu, (_, code) => String.fromCodePoint(parseInt(code, 16)))
        .replace(/&quot;/gu, '"').replace(/&#39;/gu, '\'').replace(/&lt;/gu, '<').replace(/&gt;/gu, '>')
        .replace(/&nbsp;/gu, ' ').replace(/&amp;/gu, '&');
}
