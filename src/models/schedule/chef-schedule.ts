import moment from 'moment';
import { Person, ScheduleItem } from '@/interfaces';
import { capitalize } from '@/utils';
import Chef from '../chef';
import Event from '../event';
import Schedule, { days } from './schedule';

export default class ChefSchedule extends Schedule {
  private static numDaysToAssign = 5; // Sunday–Thursday
  private static people = JSON.parse(process.env.PEOPLE || '[]') as Person[];

  static summary(chef: string | Chef, mealType = 'Main') {
    return `${capitalize(mealType)} — ${capitalize(chef instanceof Chef ? chef.name : chef)}`;
  }

  /** Construct a new Schedule, assigning each chef to one day randomly */
  // TODO handle repeat cooking days when # chefs fewer than days to cook
  static generateRandom() {
    const people = [...this.people];
    const assignedChefs: Chef[] = [];

    if (people.length >= this.numDaysToAssign) {
      while (assignedChefs.length < this.numDaysToAssign) {
        const i = Math.floor(Math.random() * people.length);
        const [person] = people.splice(i, 1);
        assignedChefs.push(new Chef(person));
      }
    }

    return new ChefSchedule(
      assignedChefs.map((chef, i) => {
        const summary = this.summary(chef);
        const start = moment().day(7); // Sunday of the coming week
        start.add(i, 'days');
        return new Event({ summary, start });
      }),
    );
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
