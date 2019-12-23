import { Event } from '.';
import capitalize from '@/utils/capitalize';

/**
 * Interface for schedule entries submitted to the chef-cal-integration API.
 *
 * @interface
 */
interface ScheduleData {
  type: string,
  chef: string,
  day: string,
}

enum days { SUN, MON, TUE, WED, THU }

export default class Schedule {
  events: Event[];

  static fromScheduleData(scheduleData: ScheduleData[], start: string): Event[] {
    return scheduleData.map(({ type, chef, day }) => {
      const summary = `${capitalize(type)} — ${capitalize(chef)}`;
      const date = new Date(start);
      date.setDate(date.getDate() + days[day.toUpperCase()]);
      return new Event({ summary, date });
    });
  }
}
