import { calendar_v3 as calendarV3 } from 'googleapis/build/src/apis/calendar/v3';
import moment from 'moment';

/**
 * Represents a date conforming to the Google Calendar API's `EventDateTime` type interface.
 *
 * @class
 * @implements {Schema$EventDateTime}
 */
export default class EventDateTime implements calendarV3.Schema$EventDateTime {
  /** Date format Google's calendar api expects */
  static readonly dateFormat = 'YYYY-MM-DD';
  private _date: string;

  get date() {
    return this._date;
  }

  constructor(date: Date) {
    this._date = moment(date).format(EventDateTime.dateFormat);
  }
}
