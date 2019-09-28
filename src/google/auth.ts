import { google } from 'googleapis';

/**
 * Obtains OAuth2 credentials from the file at the path specified by environment variable
 * `GOOGLE_APPLICATION_CREDENTIALS`, and scopes authentication to Google Calendar API requests.
 *
 * @type {Promise<Compute | JWT | UserRefreshClient>}
 */
export default google.auth.getClient({
  scopes: ['https://www.googleapis.com/auth/calendar'],
});
