import moment from 'moment';
import { ScheduleItem } from '@/interfaces';
import { Schedule } from '..';

const scheduleItem: ScheduleItem = {
  type: 'Main',
  chef: 'Lloyd',
  day: 'Sun',
};

describe('model: Schedule', () => {
  describe('methods', () => {
    describe('static fromScheduleItems', () => {
      const date = moment()
        .day(0)
        .format('YYYY-MM-DD');
      const schedule = Schedule.fromScheduleItems([scheduleItem], date);

      it('returns a Schedule instance', () => {
        expect(schedule).toBeInstanceOf(Schedule);
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
