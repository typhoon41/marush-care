import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import { environment } from '@env';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

// Serve static files from /assets for SSR (will not be shown otherwise).
app.use('/assets', express.static('dist/browser/assets', {
  maxAge: '1y',
  index: false,
  redirect: false,
}));
app.use(async (req, res, next) => {
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

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || environment.ssrPort;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
