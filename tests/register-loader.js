import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./tests/esm-loader.js', pathToFileURL('./'));
