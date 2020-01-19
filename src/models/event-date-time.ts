import { calendar_v3 as calendarV3 } from 'googleapis/build/src/apis/calendar/v3';
import moment from 'moment';

/**
 * Represents a date conforming to the Google Calendar API's `EventDateTime` type interface.
 *
 * @class
 * @implements {Schema$EventDateTime}
 */
export default class EventDateTime implements calendarV3.Schema$EventDateTime {
  static readonly dateFormat = 'YYYY-MM-DD';
  date: string;

  constructor(date: Date) {
    this.date = moment(date).format(EventDateTime.dateFormat);
  }
}
