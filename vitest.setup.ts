import 'dotenv/config'

import { requireTestDatabase } from './tests/helpers/test-database'

requireTestDatabase()

// `getPayload` waits on the SMTP transport check, and an unreachable mail host stalls it past the
// hook timeout; no suite sends mail, so without a host the config logs mail to the console.
delete process.env.SMTP_HOST
