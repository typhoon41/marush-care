import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import { environment } from '@env';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

// Serve static files from /assets for SSR (will not be shown otherwise).
app.use('/assets', express.static('dist/browser/assets'));
app.use('*', async(req, res, next) => {
  try {
    const response = await angularApp.handle(req);
    if (response) {
      await writeResponseToNodeResponse(response, res);
    } else {
      next();
    }
  }
  catch {
    next();
  }
});

if (isMainModule(import.meta.url)) {
  const PORT = process.env['PORT'] || environment.ssrPort;
  app.listen(PORT);
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
