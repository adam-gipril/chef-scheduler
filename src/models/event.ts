import { calendar_v3 as calendarV3 } from 'googleapis/build/src/apis/calendar/v3';
import { EventDateTime } from '.';

/**
 * Represents a calendar event conforming to the Google Calendar API's `Event` type interface.
 *
 * @class
 * @implements {Schema$Event}
 */
export default class Event implements calendarV3.Schema$Event {
  summary: string;
  description?: string;
  start: EventDateTime;
  end: EventDateTime;

  constructor({ summary, date }: { summary: string; date: Date }) {
    this.summary = summary;
    this.start = new EventDateTime(date);
    this.end = this.start;
  }
}
