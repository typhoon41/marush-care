/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable max-lines-per-function */
/* eslint-disable func-style */
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AngularNodeAppEngine, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const lang = basename(serverDistFolder);
  const browserDistFolder = resolve(serverDistFolder, `../browser/${lang}`);

  const angularNodeAppEngine = new AngularNodeAppEngine();

  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html'
    })
  );

  server.get('*', (req, res, next) => {
    angularNodeAppEngine
      .handle(req, { server: 'express' })
      .then(response => (response ? writeResponseToNodeResponse(response, res) : next()))
      .catch(next);
  });

  return server;
}
