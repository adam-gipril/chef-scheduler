import { google } from 'googleapis';
import client from '../auth';
import Event from './models/Event';

/**
 * Interface for schedule entries submitted to the chef-cal-integration API.
 *
 * @interface
 */
interface ScheduleData {
  type: string,
  chef: string,
  day: string,
}

enum days {
  SUN = 0,
  MON = 1,
  TUE = 2,
  WED = 3,
  THU = 4,
}

/**
 * Capitalize the first character of a string, and convert all other characters to lower case.
 *
 * @param {string} - The string to capitalize
 */
function capitalize([char, ...string]: string): string {
  return `${char.toUpperCase()}${string.join('').toLowerCase()}`;
}

const { events: calendar } = google.calendar('v3');
const calendarId = 'primary';

/**
 * Converts a schedule representation of chef assignments into an array of events formatted for
 * insertion into a Google Calendar.
 *
 * @function createEvents
 * @param {string} start The date of the schedule's first day (Sunday)
 * @param {ScheduleData[]} schedule An array of schedule entries
 * @returns {Promise<Event[]>} Promise resolving to an array of events
 */
export function createEvents(start: string, schedule: ScheduleData[]): Promise<Event[]> {
  return Promise.resolve(schedule.map(({ type, chef, day }) => {
    const summary = `${capitalize(type)} — ${capitalize(chef)}`;
    const date = new Date(start);
    date.setDate(date.getDate() + days[day.toUpperCase()]);
    return new Event(summary, date);
  }));
}

/**
 * Inserts an array of events into a Google calendar.
 *
 * @async
 * @function submitEvents
 * @param {Event[]} events An array of events to be inserted into a Google Calendar
 * @returns {Promise<object[]>} Promise resolving to an array of Google response objects
 */
export async function submitEvents(events: Event[]): Promise<object[]> {
  const auth = await client;
  const requests = events.map((event) => calendar.insert({
    auth,
    calendarId,
    requestBody: event,
  }));
  return Promise.all(requests);
}
