import { existsSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';

const repoRootEnvPath = resolve(__dirname, '../../../.env');
const cwdEnvPath = resolve(process.cwd(), '.env');

if (existsSync(repoRootEnvPath)) {
  config({ path: repoRootEnvPath });
} else if (existsSync(cwdEnvPath)) {
  config({ path: cwdEnvPath });
}
