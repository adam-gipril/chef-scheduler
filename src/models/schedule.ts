import moment from 'moment';
import { ScheduleItem } from '@/interfaces';
import Event from './event';
import capitalize from '@/utils/capitalize';

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
  static fromScheduleItems(scheduleItems: ScheduleItem[], start: string): Schedule {
    return new Schedule(
      scheduleItems.map(({ type, chef, day }) => {
        const summary = `${capitalize(type)} — ${capitalize(chef)}`;
        const date = moment(start, 'YYYY-MM-DD');
        date.add(days[day.toUpperCase()], 'days');
        return new Event({ summary, date: date.toDate() });
      }),
    );
  }
}
