import { Injectable } from '@angular/core';
import { environment } from '@env';

declare const grecaptcha: GoogleRecaptchaV3Enterprise;

@Injectable({
    providedIn: 'root'
})
export class CaptchaService {
    readonly setup = () => {
        if (environment.captchaKey === '') {
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/enterprise.js?render=${environment.captchaKey}`;
        document.head.appendChild(script);
    };

    readonly executeProtectedAction = async(actionName: string, action: (token: string, actionName: string) => Promise<void>) => {
        if (environment.captchaKey === '') {
            await action('', actionName);
            return;
        }

        grecaptcha.enterprise.ready(async() => {
            const token = await grecaptcha.enterprise.execute(environment.captchaKey, { action: actionName });
            await action(token, actionName);
        });
    };
}

interface GoogleRecaptchaV3Enterprise {
    enterprise: RecaptchaV3;
}

interface RecaptchaV3 {
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
    ready: (callback: () => void) => void;
}
