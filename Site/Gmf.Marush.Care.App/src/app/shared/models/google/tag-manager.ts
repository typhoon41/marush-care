import { Renderer2 } from '@angular/core';

const setupScriptTag = (renderer: Renderer2) => {
    const result = renderer.createElement('script') as HTMLScriptElement;
    result.type = 'text/javascript';
    result.async = true;
    result.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-PZDMH3W3');`;
    return result;
};

const setupInvocationScript = (renderer: Renderer2) => {
    const result = renderer.createElement('script') as HTMLScriptElement;
    // eslint-disable-next-line no-secrets/no-secrets
    result.innerHTML = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PZDMH3W3"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
    return result;
};

export const setupGoogleAnalytics = (renderer: Renderer2) => {
    renderer.appendChild(document.head, setupScriptTag(renderer));
    renderer.insertBefore(document.body, setupInvocationScript(renderer), document.body.firstChild);
};
