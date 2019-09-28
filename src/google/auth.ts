import { google } from 'googleapis';

/**
 * Obtains OAuth2 credentials from the `CREDENTIALS` environment variable, and scopes authentication
 * to just Google Calendar API requests.
 *
 * @type {Promise<Compute | JWT | UserRefreshClient>}
 */
export default google.auth.getClient({
  credentials: JSON.parse(process.env.CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});
