import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { request } from 'node:http';
import { createServer } from 'node:net';
import { join } from 'node:path';

// Runs the BUILT server (dist/server/server.mjs) exactly as production does; it never builds anything itself.
export class ServerProcess {
    static entry = join('dist', 'server', 'server.mjs');
    static readinessTimeout = 60000;
    static pollInterval = 250;

    constructor(appRoot) {
        this.appRoot = appRoot;
        this.output = [];
        this.child = undefined;
        this.port = undefined;
    }

    start = async () => {
        const entry = join(this.appRoot, ServerProcess.entry);
        if (!existsSync(entry)) {
            throw new Error(`${entry} is missing: run "npm run build -- --configuration=production" first.`);
        }
        this.port = await ServerProcess.freePort();
        this.child = spawn(process.execPath, [ServerProcess.entry], {
            cwd: this.appRoot,
            env: { ...process.env, PORT: String(this.port) },
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });
        this.child.stdout.on('data', chunk => this.output.push(chunk.toString()));
        this.child.stderr.on('data', chunk => this.output.push(chunk.toString()));
        process.once('exit', this.stop);
        await this.waitUntilReady();
        return this.port;
    };

    stop = () => {
        if (this.child && this.child.exitCode === null && !this.child.killed) {
            this.child.kill();
        }
    };

    stopped = async () => {
        if (!this.child || this.child.exitCode !== null) {
            return;
        }
        const exited = new Promise(resolve => this.child.once('exit', resolve));
        this.stop();
        await exited;
    };

    waitUntilReady = async () => {
        const deadline = Date.now() + ServerProcess.readinessTimeout;
        while (Date.now() < deadline) {
            if (this.child.exitCode !== null) {
                throw new Error(`The server exited with code ${this.child.exitCode}:\n${this.output.join('')}`);
            }
            if (await this.responds()) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, ServerProcess.pollInterval));
        }
        this.stop();
        throw new Error(`The server did not answer within ${ServerProcess.readinessTimeout} ms:\n${this.output.join('')}`);
    };

    responds = () => new Promise(resolve => {
        const probe = request({ host: '127.0.0.1', port: this.port, path: '/assets/favicon.ico', headers: { host: 'localhost' } },
            response => {
                response.resume();
                resolve(true);
            });
        probe.on('error', () => resolve(false));
        probe.end();
    });

    static freePort = () => new Promise((resolve, reject) => {
        const server = createServer();
        server.on('error', reject);
        server.listen(0, '127.0.0.1', () => {
            const { port } = server.address();
            server.close(() => resolve(port));
        });
    });
}
