import moment from 'moment';
import { ScheduleItem } from '@/interfaces';
import { capitalize } from '@/utils';
import Event from './event';

/** Maps day of the week to 0–6 numeric value */
enum days {
  SUN,
  MON,
  TUE,
  WED,
  THU,
  FRI,
  SAT,
}

/** Represents a collection of Google Calendar events */
export default class Schedule {
  private constructor(public events: Event[]) {}

  /** Construct a new Schedule from data conforming to the chef-cal-integration external API */
  static fromScheduleItems(scheduleItems: ScheduleItem[], startDateString: string) {
    return new Schedule(
      scheduleItems.map(({ type, chef, day }) => {
        const summary = `${capitalize(type)} — ${capitalize(chef)}`;
        const start = moment(startDateString, 'YYYY-MM-DD');
        start.add(days[day.toUpperCase()], 'days');
        return new Event({ summary, start });
      }),
    );
  }
}
