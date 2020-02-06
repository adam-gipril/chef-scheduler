import moment from 'moment';
import { Person } from '@/interfaces';
import { Chef, Event } from '..';

const person: Person = {
  name: 'Hank',
  email: 'hank@hill.com',
  phone: '18885556969',
  calendarId: 'my-calendar',
};

const exclusions = [
  new Event({
    summary: 'my Monday event',
    date: moment()
      .day(8)
      .toDate(),
  }),
  new Event({
    summary: 'my Tuesday event',
    date: moment()
      .day(9)
      .toDate(),
  }),
];

const chef = new Chef(person, exclusions);

describe('model: Chef', () => {
  describe('constructor', () => {
    it('assigns properties from the passed-in Person', () => {
      Object.keys(person).forEach(key => {
        expect(person[key]).toBe(chef[key]);
      });
    });
  });

  describe('getters', () => {
    describe('excludedDaysNextWeek', () => {
      it('returns days of exclusions next week', () => {
        expect(chef.excludedDaysNextWeek).toStrictEqual([8, 9]);
      });
    });
  });
});
