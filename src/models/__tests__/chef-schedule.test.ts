import moment from 'moment';
import { Person } from '@/interfaces';
import { GoogleCalendarService } from '@/services';
import { ChefSchedule, Chef } from '..';

// FIXME correctly sandbox so this doesn't need to be mocked
jest.mock('twilio');
const spyQueryAndSetChefsAvailabilityNextWeek = jest
  .spyOn(GoogleCalendarService, 'queryAndSetChefsAvailabilityNextWeek')
  .mockImplementation(async (chefs: Chef[]) => {
    chefs.forEach((chef, i) => {
      Object.keys(chef.availabilityNextWeek).forEach(day => {
        /* eslint-disable-next-line no-param-reassign */
        chef.availabilityNextWeek[day] = +day === i + 7;
      });
    });
  });

const people: Person[] = [
  { name: 'Terri', email: '', phone: '', calendarId: '0' },
  { name: 'Larry', email: '', phone: '', calendarId: '1' },
  { name: 'Harry', email: '', phone: '', calendarId: '2' },
  { name: 'Barry', email: '', phone: '', calendarId: '3' },
  { name: 'Cheri', email: '', phone: '', calendarId: '4' },
];

describe('model: ChefSchedule', () => {
  describe('methods', () => {
    let PEOPLE: string;

    describe('static generate', () => {
      let schedule: ChefSchedule;

      beforeAll(async () => {
        PEOPLE = process.env.PEOPLE;
        process.env.PEOPLE = JSON.stringify(people);
        schedule = await ChefSchedule.generate();
      });

      afterAll(() => {
        process.env.PEOPLE = PEOPLE;
      });

      it('returns a ChefSchedule instance', () => {
        expect(schedule).toBeInstanceOf(ChefSchedule);
      });

      it('schedules an event for each of Sunday–Thursday', () => {
        schedule.events.sort(
          (a, b) =>
            +moment(a.start.date, 'YYYY-MM-DD').format('d') -
            +moment(b.start.date, 'YYYY-MM-DD').format('d'),
        );
        schedule.events.forEach((event, i) => {
          const day = +moment(event.start.date, 'YYYY-MM-DD').format('d');
          expect(day).toBe(i);
        });
      });

      // TODO handle cases when there are fewer chefs than days to assign
      it('assigns each chef at most one event', () => {
        const chefs = new Set();
        schedule.events.forEach(event => chefs.add(event.summary));
        expect(chefs.size).toBe(schedule.events.length);
      });

      it('does not schedule a chef to cook on a day they are busy', () => {
        schedule.events.sort(
          (a, b) =>
            +moment(a.start.date, 'YYYY-MM-DD').format('d') -
            +moment(b.start.date, 'YYYY-MM-DD').format('d'),
        );
        schedule.events.forEach((event, i) => expect(event.summary.includes(people[i].name)));
      });

      it('does not schedule a chef with no availability', async () => {
        spyQueryAndSetChefsAvailabilityNextWeek.mockImplementationOnce(async (chefs: Chef[]) => {
          Object.keys(chefs[0].availabilityNextWeek).forEach(day => {
            // eslint-disable-next-line no-param-reassign
            chefs[0].availabilityNextWeek[day] = false;
          });
        });

        schedule = await ChefSchedule.generate();

        expect(schedule.events).toBeDefined();
        expect(schedule.events).toHaveLength(people.length - 1);
        schedule.events.forEach(event => {
          expect(event.summary).not.toContain(people[0].name);
        });
      });
    });

    describe('static generateRandom', () => {
      let schedule = ChefSchedule.generateRandom();

      it('returns a ChefSchedule instance', () => {
        expect(schedule).toBeInstanceOf(ChefSchedule);
      });

      it('schedules an event for each of Sunday–Thursday', () => {
        schedule.events.forEach((event, i) => {
          const day = +moment(event.start.date, 'YYYY-MM-DD').format('d');
          expect(day).toBe(i);
        });
      });

      // TODO handle cases when there are fewer chefs than days to assign
      it('assigns each chef at most one event', () => {
        const chefs = new Set();
        schedule.events.forEach(event => chefs.add(event.summary));
        expect(chefs.size).toBe(schedule.events.length);
      });

      it('does not crash when fewer chefs than days to assign exist', () => {
        PEOPLE = process.env.PEOPLE;
        process.env.PEOPLE = JSON.stringify(people.slice(0, 1));
        schedule = ChefSchedule.generateRandom();
        expect(schedule.events).toHaveLength(0);
        process.env.PEOPLE = PEOPLE;
      });
    });
  });
});
