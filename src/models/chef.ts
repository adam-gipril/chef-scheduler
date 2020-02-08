import { calendar_v3 as calendarV3 } from 'googleapis/build/src/apis/calendar/v3';
import moment from 'moment';
import { Person } from '@/interfaces';

/** A person who cooks */
export default class Chef implements Person {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly calendarId: string;
  /** Chef's availability next week encoded into numeric values usable by Moment.js */
  readonly availabilityNextWeek = {
    7: true, //  Sunday
    8: true, //  Monday
    9: true, //  Tuesday
    10: true, // Wednesday
    11: true, // Thursday
    12: true, // Friday
    13: true, // Saturday
  };

  score?: number; // TODO score will depend on cooking history

  constructor(person: Person) {
    Object.assign(this, person);
  }

  /**
   * Set chef's availability next week from passed-in busy time periods
   *
   * @param {calendarV3.Schema$TimePeriod[]} busyPeriods
   * time periods next week during which chef is busy
   */
  setAvailabilityNextWeek(busyPeriods = [] as calendarV3.Schema$TimePeriod[]) {
    busyPeriods.forEach(({ start, end }) => {
      const startDay = moment(start).day() + 7;
      const endDay = moment(end).day() + 7;
      Array.from(Array(endDay - startDay + 1), (_, i) => startDay + i).forEach(day => {
        this.availabilityNextWeek[day] = false;
      });
    });
  }
}
