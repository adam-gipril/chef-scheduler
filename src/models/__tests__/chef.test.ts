import { calendar_v3 as calendarV3 } from 'googleapis/build/src/apis/calendar/v3';
import moment from 'moment';
import { Person } from '@/interfaces';
import { Chef } from '..';

// FIXME correctly sandbox so this doesn't need to be mocked
jest.mock('twilio');

const person: Person = {
  name: 'Hank',
  email: 'hank@hill.com',
  phone: '18885556969',
  calendarId: 'my-calendar',
};

let chef: Chef;
const busyPeriods: calendarV3.Schema$TimePeriod[] = [
  {
    start: moment()
      .day(8)
      .format(),
    end: moment()
      .day(8)
      .format(),
  },
  {
    start: moment()
      .day(10)
      .format(),
    end: moment()
      .day(12)
      .format(),
  },
];

describe('model: Chef', () => {
  beforeEach(() => {
    chef = new Chef(person);
  });

  describe('getters', () => {
    describe('availabilityScore', () => {
      it('returns normalized sum of days chef is available to cook', () => {
        expect(chef.availabilityScore).toBe(1);
        chef.setAvailabilityNextWeek(busyPeriods);
        expect(chef.availabilityScore).toBe(2 / 5);
      });
    });
  });

  describe('constructor', () => {
    it('assigns properties from the passed-in Person', () => {
      Object.keys(person).forEach(key => {
        expect(person[key]).toBe(chef[key]);
      });
    });
  });

  describe('methods', () => {
    describe('setAvailabilityNextWeek', () => {
      it('sets availability of each busy day to "false"', () => {
        Object.keys(chef.availabilityNextWeek).forEach(day => {
          expect(chef.availabilityNextWeek[day]).toBe(true);
        });

        chef.setAvailabilityNextWeek(busyPeriods);
        Object.keys(chef.availabilityNextWeek).forEach(day => {
          expect(chef.availabilityNextWeek[day]).toBe(![8, 10, 11, 12].includes(+day));
        });
      });
    });
  });
});
