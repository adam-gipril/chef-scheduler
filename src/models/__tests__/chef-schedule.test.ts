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
