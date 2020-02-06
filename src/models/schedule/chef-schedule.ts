import moment from 'moment';
import { ScheduleItem } from '@/interfaces';
import { capitalize } from '@/utils';
import Chef from '../chef';
import Event from '../event';
import Schedule, { days } from './schedule';

export default class ChefSchedule extends Schedule {
  static summary(chef: string | Chef, mealType = 'Main') {
    return `${capitalize(mealType)} — ${capitalize(chef instanceof Chef ? chef.name : chef)}`;
  }

  /** Construct a ChefSchedule from data conforming to the chef-cal-integration external API */
  static fromScheduleItems(scheduleItems: ScheduleItem[], startDateString: string) {
    return new ChefSchedule(
      scheduleItems.map(({ chef, day, type = 'Main' }) => {
        const summary = this.summary(chef, type);
        const start = moment(startDateString, 'YYYY-MM-DD');
        start.add(days[day.toUpperCase()], 'days');
        return new Event({ summary, start });
      }),
    );
  }
}
