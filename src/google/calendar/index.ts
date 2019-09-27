import { google } from 'googleapis';
import client from '../auth';
import Event from './models/Event';

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

function capitalize([char, ...string]: string): string {
  return `${char.toUpperCase()}${string.join('').toLowerCase()}`;
}

const { events: calendar } = google.calendar('v3');
const calendarId = 'primary';

export function createEvents(start: string, schedule: ScheduleData[]): Promise<Event[]> {
  return Promise.resolve(schedule.map(({ type, chef, day }) => {
    const summary = `${capitalize(type)} — ${capitalize(chef)}`;
    const date = new Date(start);
    date.setDate(date.getDate() + days[day.toUpperCase()]);
    return new Event(summary, date);
  }));
}

export async function submitEvents(events: Event[]): Promise<object> {
  const auth = await client;
  const requests = events.map((event) => calendar.insert({
    auth,
    calendarId,
    requestBody: event,
  }));
  return Promise.all(requests);
}
