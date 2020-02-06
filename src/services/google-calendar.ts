import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { Event } from '@/models';

/** Interface for Google's Calendar API */
export default class GoogleCalendarService {
  /** APIs for Google Calendar */
  private static readonly chefSchedule = google.calendar('v3');

  /** Provides service account authentication for Google Calendar */
  private static readonly googleAuthInstance = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  /** Obtain a JWT to authenticate Google Calendar requests */
  private static getJWT() {
    // TODO reuse token and refresh only as needed
    return this.googleAuthInstance.getClient() as Promise<JWT>;
  }

  /**
   * Insert events into a Google calendar
   *
   * @param {Event[]} events array of events to be inserted
   * @param {string} [calendarId=primary] (optional) calendar to which events will be added
   */
  static async addEvents(events: Event[], calendarId = 'primary') {
    const auth = await this.getJWT();
    const requests = events.map(event =>
      this.chefSchedule.events.insert({ auth, calendarId, requestBody: event }),
    );
    await Promise.all(requests);
  }
}
