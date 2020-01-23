import moment from 'moment';
import { Schedule } from '..';
import { ScheduleData } from '../schedule';

const scheduleData: ScheduleData = {
  type: 'Main',
  chef: 'Lloyd',
  day: 'Sun',
};

describe('model: Schedule', () => {
  describe('methods', () => {
    describe('static fromScheduleData', () => {
      const date = moment()
        .day(0)
        .format('YYYY-MM-DD');
      const schedule = Schedule.fromScheduleData([scheduleData], date);

      it('returns a new Schedule instance', () => {
        expect(schedule).toBeInstanceOf(Schedule);
      });

      it('sets the schedule data', () => {
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
