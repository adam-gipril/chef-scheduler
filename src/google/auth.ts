import { google } from 'googleapis';

// This method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
// environment variables.
export default google.auth.getClient({
  scopes: ['https://www.googleapis.com/auth/calendar'],
});
