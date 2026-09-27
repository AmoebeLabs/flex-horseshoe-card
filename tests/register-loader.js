import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Calendar fixtures use UTC; individual local-calendar tests select and restore their own zone.
process.env.TZ = 'Etc/UTC';

register('./tests/esm-loader.js', pathToFileURL('./'));
