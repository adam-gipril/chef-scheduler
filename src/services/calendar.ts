/* eslint-disable import/prefer-default-export */
import { google } from 'googleapis';
import { Event } from '@/models';
import googleClient from '@/clients/google';

/**
 * Inserts an array of events into a Google calendar.
 *
 * @async
 * @function submitEvents
 * @param {Event[]} events An array of events to be inserted into a Google Calendar
 * @returns {Promise<object[]>} Promise resolving to an array of Google response objects
 */
export async function submitEvents(events: Event[]): Promise<object[]> {
  const auth = await googleClient;
  const calendarId = 'primary';
  const { events: calendar } = google.calendar('v3');
  const requests = events.map((event) => calendar.insert({
    auth,
    calendarId,
    requestBody: event,
  }));
  return Promise.all(requests);
}
