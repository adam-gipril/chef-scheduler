import moment from 'moment';
import { Person, ScheduleItem } from '@/interfaces';
import { GoogleCalendarService } from '@/services';
import { ChefSchedule, Chef } from '..';

jest
  .spyOn(GoogleCalendarService, 'queryAndSetChefsAvailabilityNextWeek')
  .mockImplementation(async (chefs: Chef[]) => {
    chefs.forEach((chef, i) => {
      Object.keys(chef.availabilityNextWeek).forEach(day => {
        // eslint-disable-next-line no-param-reassign
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

const scheduleItem: ScheduleItem = {
  type: 'Main',
  chef: 'Lloyd',
  day: 'Sun',
};

describe('model: ChefSchedule', () => {
  describe('methods', () => {
    describe('static generate', () => {
      let schedule: ChefSchedule;
      let PEOPLE: string;

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
    });

    describe('static generateRandom', () => {
      const schedule = ChefSchedule.generateRandom();

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
    });

    describe('static fromScheduleItems', () => {
      const date = moment()
        .day(0)
        .format('YYYY-MM-DD');
      const schedule = ChefSchedule.fromScheduleItems([scheduleItem], date);

      it('returns a ChefSchedule instance', () => {
        expect(schedule).toBeInstanceOf(ChefSchedule);
      });

      it('sets the schedule', () => {
        const [event] = schedule.events;
        expect(schedule.events).toHaveLength(1);
        expect(event.summary).toContain('Main');
        expect(event.summary).toContain('Lloyd');
        expect(event.start.date).toBe(date);
        expect(event.end.date).toBe(date);
      });
    });
  });
});
