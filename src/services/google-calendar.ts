import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { Event } from '@/models';

/** Interface for Google's Calendar API */
export default class GoogleCalendarService {
  /** Provides Google service-to-service authentication for Google Calendar */
  private static readonly googleAuthInstance = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  /** Obtain a JWT to authenticate Google Calendar requests */
  private static getJWT() {
    return this.googleAuthInstance.getClient() as Promise<JWT>;
  }

  /**
   * Inserts events into a Google calendar
   *
   * @param {Event[]} events array of events to be inserted
   * @param {string} [calendarId=primary] (optional) calendar to which events will be added
   * @returns {Promise<GaxiosResponse<calendar_v3.Schema$Event>[]>} array of responses
   */
  static async addEvents(events: Event[], calendarId = 'primary') {
    const auth = await this.getJWT();
    const { events: calendar } = google.calendar('v3');
    const requests = events.map(event =>
      calendar.insert({
        auth,
        calendarId,
        requestBody: event,
      }),
    );
    return Promise.all(requests);
  }
}
