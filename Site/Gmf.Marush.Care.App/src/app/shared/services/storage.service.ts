import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    readonly save = (key: string, value: string) => {
        localStorage.setItem(key, value);
    };

    readonly load = (key: string) => {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(key);
        }

        return undefined;
    };
}
