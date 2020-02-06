import { calendar_v3 as calendarV3 } from 'googleapis/build/src/apis/calendar/v3';
import { Moment } from 'moment';

/** Represents a date conforming to the Google Calendar API's `EventDateTime` type interface. */
export default class EventDateTime implements calendarV3.Schema$EventDateTime {
  /** Date format Google's calendar API expects */
  static readonly dateFormat = 'YYYY-MM-DD';
  readonly date: string;

  /**
   * Create an EventDateTime for an all-day Google Calendar event
   *
   * @param {Moment} date Day on which the all-day event falls
   */
  constructor(date: Moment) {
    this.date = date.format(EventDateTime.dateFormat);
  }
}
