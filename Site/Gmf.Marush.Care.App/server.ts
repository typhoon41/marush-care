import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import { environment } from '@env';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use('*', (req, res, next) => {
  angularApp
    .handle(req)
    .then(response => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4141;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
