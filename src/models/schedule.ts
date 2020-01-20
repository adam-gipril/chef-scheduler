import moment from 'moment';
import { Event } from '.';
import capitalize from '@/utils/capitalize';

/**
 * Interface for schedule entries submitted to the chef-cal-integration API.
 *
 * @interface
 */
export interface ScheduleData {
  type: string;
  chef: string;
  day: string;
}

enum days {
  SUN,
  MON,
  TUE,
  WED,
  THU,
}

export default class Schedule {
  constructor(public events: Event[]) {}

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
