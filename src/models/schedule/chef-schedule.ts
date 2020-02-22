import moment from 'moment';
import { Person } from '@/interfaces';
import { GoogleCalendarService } from '@/services';
import { capitalize } from '@/utils';
import Chef from '../chef';
import Event from '../event';
import Schedule from './schedule';

export default class ChefSchedule extends Schedule {
  private static numDaysToAssign = 5; // Sunday–Thursday
  private static get people() {
    return JSON.parse(process.env.PEOPLE) as Person[];
  }

  static summary(chef: string | Chef, mealType = 'Main') {
    return `${capitalize(mealType)} — ${capitalize(chef instanceof Chef ? chef.name : chef)}`;
  }

  /** Construct a ChefSchedule, taking chefs' availability into account */
  // TODO handle repeat cooking days when # chefs fewer than # days to cook
  static async generate() {
    const daysToAssign = Array.from(Array(this.numDaysToAssign), (_, i) => i + 7);
    const chefs = this.people.map(person => new Chef(person));
    await GoogleCalendarService.queryAndSetChefsAvailabilityNextWeek(chefs);
    const selectedChefs = Array.from(daysToAssign, () => {
      let chef: Chef;

      while (!chef && chefs.length) {
        const i = Math.floor(Math.random() * chefs.length);
        const [selectedChef] = chefs.splice(i, 1);
        // if selectedChef has any availability, preserve the selection
        if (selectedChef.availabilityScore > 0) {
          chef = selectedChef;
        }
      }

      return chef;
    }).filter(chef => !!chef);

    selectedChefs.sort((a, b) => a.availabilityScore - b.availabilityScore);
    return new ChefSchedule(
      selectedChefs.map(chef => {
        const summary = this.summary(chef);
        const i = daysToAssign.findIndex(dayToAssign => chef.availabilityNextWeek[dayToAssign]);
        const [day] = daysToAssign.splice(i, 1);
        const start = moment().day(day);
        return new Event({ summary, start });
      }),
    );
  }

  /** Construct a ChefSchedule, assigning each chef to one day randomly */
  // TODO handle repeat cooking days when # chefs fewer than # days to cook
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
}
