import { calendar_v3 as calendarV3 } from 'googleapis/build/src/apis/calendar/v3';
import { EventDateTime } from '.';

/** Represents a calendar event conforming to the Google Calendar API's `Event` type interface. */
export default class Event implements calendarV3.Schema$Event {
  summary: string;
  description?: string;
  start: EventDateTime;
  end: EventDateTime;

  /**
   * Create an all-day Google Calendar event ready to be added to a calendar
   *
   * @param eventDetails Summary and date on which the all-day event falls
   */
  constructor({ summary, date }: { summary: string; date: Date }) {
    this.summary = summary;
    this.start = new EventDateTime(date);
    this.end = this.start;
  }
}
