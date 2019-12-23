import { calendar_v3 as calendarV3 } from 'googleapis/build/src/apis/calendar/v3';

/**
 * Convert a value to a string, and add zero-padding to values less than 10.
 *
 * @function conform
 * @param {number} day A number representing a month or a day of the month
 * @returns {string} String conversion of the input number, with single left-side zero-pad on values
 * less than 10
 */
function conform(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

/**
 * Represents a date conforming to the Google Calendar API's `EventDateTime` type interface.
 *
 * @class
 * @implements {Schema$EventDateTime}
 */
export default class EventDateTime implements calendarV3.Schema$EventDateTime {
  date: string;

  constructor(date: Date) {
    this.setDate(date);
  }

  /**
   * Conform the input date to the format expected by Google's Calendar API. No return value, and
   * has the side effect of setting the instance's date to a conformant string.
   *
   * @function setDate
   * @param {Date} date The date of the event
   * @private
   */
  private setDate(date: Date) {
    const yyyy = date.getFullYear();
    const mm = conform(date.getMonth() + 1); // date.getMonth() is zero-indexed
    const dd = conform(date.getDate());
    this.date = `${yyyy}-${mm}-${dd}`;
  }
}
