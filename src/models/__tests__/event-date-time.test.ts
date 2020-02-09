import moment from 'moment';
import { EventDateTime } from '..';

// FIXME correctly sandbox so this doesn't need to be mocked
jest.mock('twilio');

describe('model: EventDateTime', () => {
  describe('constructor', () => {
    it('formats date as Google expects', () => {
      const { date } = new EventDateTime(moment());
      expect(moment(date, EventDateTime.dateFormat).isValid()).toBe(true);
    });
  });
});
