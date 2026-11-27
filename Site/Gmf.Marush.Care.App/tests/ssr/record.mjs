import { SsrSnapshot } from './ssr-snapshot.mjs';

// Records tests/ssr/baseline.json from the current build. Run it only against the reference (pre-upgrade) build.
const snapshot = await SsrSnapshot.record();
console.log(`Recorded ${Object.keys(snapshot.entries).length} route x host answers to ${SsrSnapshot.baselinePath}`);
console.log(`By status: ${JSON.stringify(SsrSnapshot.summary(snapshot))}`);
