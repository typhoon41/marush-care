import { app as serverEn } from './server/en/server.mjs';
import { app as serverRu } from './server/ru/server.mjs';
import { app as serverSr } from './server/sr/server.mjs';

const express = require('express');

function run() {
  const port = process.env.PORT || 4000;
  const server = express();

  server.use('/sr', serverSr());
  server.use('/en', serverEn());
  server.use('/ru', serverRu());
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();