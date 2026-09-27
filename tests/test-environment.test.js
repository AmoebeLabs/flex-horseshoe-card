import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

// Start fresh processes so each runner inherits the host zone before the bootstrap.
for (const timeZone of ['UTC', 'Europe/Amsterdam', 'America/Los_Angeles']) {
  test(`test bootstrap selects UTC when the host uses ${timeZone}`, () => {
    // Probe a plain Node process, without the parent runner's test-output transport.
    const env = { ...process.env, TZ: timeZone };
    delete env.NODE_TEST_CONTEXT;
    const result = spawnSync(process.execPath, [
      '--import', './tests/register-loader.js',
      '--input-type=module', '--eval',
      'console.log(JSON.stringify([process.env.TZ, new Date("2026-08-20T12:00:00Z").getTimezoneOffset()]));',
    ], { cwd: new URL('..', import.meta.url), env, encoding: 'utf8' });

    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), ['Etc/UTC', 0]);
  });
}
