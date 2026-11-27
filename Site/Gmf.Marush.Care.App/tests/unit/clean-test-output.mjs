import { rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The unit-test builder leaves its bundles in dist/test-out; ESLint would lint them, so they go before and after each run.
rmSync(join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist', 'test-out'), { recursive: true, force: true });
