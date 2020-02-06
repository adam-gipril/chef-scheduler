import { calendar_v3 as calendarV3 } from 'googleapis/build/src/apis/calendar/v3';
import { Moment } from 'moment';
import EventDateTime from './event-date-time';

interface EventDetails {
  summary: string;
  start: Moment;
  end?: Moment;
  description?: string;
}

/** Represents a calendar event conforming to the Google Calendar API's `Event` type interface. */
export default class Event implements calendarV3.Schema$Event {
  summary: string;
  start: EventDateTime;
  end: EventDateTime;
  description?: string;

  /**
   * Create a Google Calendar event ready to be added to a calendar
   *
   * @param eventDetails Summary and date on which the all-day event falls
   */
  constructor({ summary, start, end = start, description }: EventDetails) {
    this.summary = summary;
    this.start = new EventDateTime(start);
    this.end = end === start ? this.start : new EventDateTime(end);
    this.description = description;
  }
}
