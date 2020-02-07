import moment from 'moment';
import { ScheduleItem } from '@/interfaces';
import { ChefSchedule } from '..';

const scheduleItem: ScheduleItem = {
  type: 'Main',
  chef: 'Lloyd',
  day: 'Sun',
};

describe('model: ChefSchedule', () => {
  describe('methods', () => {
    describe('static generateRandom', () => {
      const schedule = ChefSchedule.generateRandom();

      it('returns a Schedule instance', () => {
        expect(schedule).toBeInstanceOf(ChefSchedule);
      });

      it('schedules an event for each of Sunday–Thursday', () => {
        schedule.events.forEach((event, i) => {
          const day = +moment(event.start.date, 'YYYY-MM-DD').format('d');
          expect(day).toBe(i);
        });
      });

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

      it('returns a Schedule instance', () => {
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
