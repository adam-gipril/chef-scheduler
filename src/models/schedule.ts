import moment from 'moment';
import { Event } from '.';
import capitalize from '@/utils/capitalize';

/** Interface for schedule entries submitted to the chef-cal-integration API. */
export interface ScheduleData {
  type: string;
  chef: string;
  day: string;
}

/** Maps day of the week to 0–4 numeric value */
enum days {
  SUN,
  MON,
  TUE,
  WED,
  THU,
}

/** Represents a collection of Google Calendar events */
export default class Schedule {
  constructor(public events: Event[]) {}

  /** Construct a new Schedule from data conforming to the chef-cal-integration external API */
  static fromScheduleData(scheduleData: ScheduleData[], start: string): Schedule {
    return new Schedule(
      scheduleData.map(({ type, chef, day }) => {
        const summary = `${capitalize(type)} — ${capitalize(chef)}`;
        const date = moment(start, 'YYYY-MM-DD');
        date.add(days[day.toUpperCase()], 'days');
        return new Event({ summary, date: date.toDate() });
      }),
    );
  }
}
