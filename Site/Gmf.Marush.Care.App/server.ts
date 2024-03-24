/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable max-lines-per-function */
/* eslint-disable func-style */
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { REQUEST, RESPONSE } from './src/express.tokens';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));

  /**
   * Get the language from the corresponding folder
   */
  const lang = basename(serverDistFolder);

  /**
   * Set the route for static content and APP_BASE_HREF
   */
  const langPath = `/${lang}/`;

  /**
   * Note that the 'browser' folder is located two directories above 'server/{lang}/'
   */
  const browserDistFolder = resolve(serverDistFolder, `../../browser/${lang}`);
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // Server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  // Complete the route for static content by concatenating the language.
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y'
    })
  );

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    // Discard baseUrl as we will provide it with langPath
    const { protocol, originalUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        // PublicPath does not need to concatenate the language.
        publicPath: resolve(serverDistFolder, `../../browser/`),
        providers: [
          { provide: APP_BASE_HREF, useValue: langPath },
          { provide: LOCALE_ID, useValue: lang },
          { provide: RESPONSE, useValue: res },
          { provide: REQUEST, useValue: req }
        ]
      })
      // eslint-disable-next-line xss/no-mixed-html
      .then(html => res.send(html))
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(_ => {});
  });

  return server;
}
