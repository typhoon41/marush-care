import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PageSnapshot } from './page-snapshot.mjs';
import { RouteMatrix } from './route-matrix.mjs';
import { ServerProcess } from './server-process.mjs';

// Captures every route x host answer of the built server, and compares a capture with the recorded baseline.
export class SsrSnapshot {
    static appRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
    static baselinePath = join(dirname(fileURLToPath(import.meta.url)), 'baseline.json');

    static keyOf = ({ host, path, acceptLanguage }) =>
        `${host} ${path}${acceptLanguage ? ` [accept-language: ${acceptLanguage}]` : ''}`;

    static capture = async () => {
        const server = new ServerProcess(SsrSnapshot.appRoot);
        try {
            const port = await server.start();
            const entries = {};
            for (const route of new RouteMatrix(SsrSnapshot.appRoot).requests()) {
                entries[SsrSnapshot.keyOf(route)] = { route: route.route, ...await PageSnapshot.capture(port, route) };
            }
            return { entries };
        } finally {
            await server.stopped();
        }
    };

    static record = async () => {
        const snapshot = await SsrSnapshot.capture();
        writeFileSync(SsrSnapshot.baselinePath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
        return snapshot;
    };

    static baseline = () => {
        if (!existsSync(SsrSnapshot.baselinePath)) {
            throw new Error(`${SsrSnapshot.baselinePath} is missing: run "npm run test:ssr:record" against the reference build first.`);
        }
        const baseline = JSON.parse(readFileSync(SsrSnapshot.baselinePath, 'utf8'));
        if (Object.keys(baseline.entries ?? {}).length === 0) {
            throw new Error(`${SsrSnapshot.baselinePath} has no entries, so it proves nothing.`);
        }
        return baseline;
    };

    static differences = (expected, actual) => {
        const lines = [];
        const keys = [...new Set([...Object.keys(expected.entries), ...Object.keys(actual.entries)])].sort();
        for (const key of keys) {
            const before = expected.entries[key];
            const after = actual.entries[key];
            if (!after) {
                lines.push(`- ${key}: in the baseline, not requested any more`);
                continue;
            }
            if (!before) {
                lines.push(`+ ${key}: requested now, not in the baseline`);
                continue;
            }
            for (const field of [...new Set([...Object.keys(before), ...Object.keys(after)])]) {
                if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) {
                    lines.push(`~ ${key} ${field}: ${JSON.stringify(before[field])} -> ${JSON.stringify(after[field])}`);
                }
            }
        }
        return lines;
    };

    static summary = ({ entries }) => {
        const byStatus = {};
        for (const entry of Object.values(entries)) {
            const kind = `${entry.status}${entry.serverRendered ? ' ssr' : ''}`;
            byStatus[kind] = (byStatus[kind] ?? 0) + 1;
        }
        return byStatus;
    };
}
