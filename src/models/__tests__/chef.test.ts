import { Person } from '@/interfaces';
import { Chef } from '..';

const person: Person = {
  name: 'Hank',
  email: 'hank@hill.com',
  phone: '18885556969',
  calendarId: 'my-calendar',
};

const chef = new Chef(person);

describe('model: Chef', () => {
  describe('constructor', () => {
    it('assigns properties from the passed-in Person', () => {
      Object.keys(person).forEach(key => {
        expect(person[key]).toBe(chef[key]);
      });
    });
  });
});
