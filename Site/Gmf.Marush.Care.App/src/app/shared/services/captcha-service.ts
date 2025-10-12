import { Injectable } from '@angular/core';
import { environment } from '@env';

declare const grecaptcha: GoogleRecaptchaV3Enterprise;

@Injectable({
    providedIn: 'root'
})
export class CaptchaService {
    readonly setup = (script: HTMLScriptElement) => {
        if (environment.captchaKey === '') {
            return script;
        }

        script.src = `https://www.google.com/recaptcha/enterprise.js?render=${environment.captchaKey}`;
        script.async = true;
        script.defer = true;
        script.type = 'text/javascript';
        return script;
    };

    readonly executeProtectedAction = async(actionName: string, action: (token: string, actionName: string) => Promise<void>) => {
        if (environment.captchaKey === '') {
            await action('', actionName);
            return '';
        }

        // eslint-disable-next-line promise/avoid-new
        return new Promise((resolve, reject) => {
            grecaptcha.enterprise.ready(
                () =>
                  // eslint-disable-next-line no-void
                  void (async() => {
                    try {
                        const token = await grecaptcha.enterprise.execute(
                            environment.captchaKey,
                            { action: actionName }
                        );

                        await action(token, actionName);
                        resolve(token);
                    }
                    catch(error) {
                        reject(error);
                    }
                  })());
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
