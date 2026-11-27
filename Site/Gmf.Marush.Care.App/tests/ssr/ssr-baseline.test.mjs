import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SsrSnapshot } from './ssr-snapshot.mjs';

test('the built server answers every route x host exactly as the recorded baseline', async (context) => {
    const baseline = SsrSnapshot.baseline();
    const actual = await SsrSnapshot.capture();
    const executed = Object.keys(actual.entries).length;
    context.diagnostic(`equivalence cases executed: ${executed}`);
    context.diagnostic(`by status: ${JSON.stringify(SsrSnapshot.summary(actual))}`);

    assert.ok(executed > 0, 'No route was requested, so nothing was proven.');
    const differences = SsrSnapshot.differences(baseline, actual);
    assert.equal(differences.length, 0, `The SSR output differs from tests/ssr/baseline.json:\n${differences.join('\n')}`);
});
