import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CookieStorage {
    readonly save = (key: string, value: string) => {
        const date = new Date();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        date.setTime(date.getTime() + oneYear);
        const inOneYear = date.toUTCString();

        document.cookie = `${key}=${value}; expires=${inOneYear}; SameSite=Strict; Secure; path=/`;
    };

    readonly load = (key: string) => {
        const cookieValue = document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`);
        return cookieValue ? cookieValue.pop() : undefined;
    };
}
