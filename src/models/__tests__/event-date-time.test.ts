import moment from 'moment';
import { EventDateTime } from '..';

describe('model: EventDateTime', () => {
  describe('constructor', () => {
    it('formats date as Google expects', () => {
      const { date } = new EventDateTime(moment().toDate());
      expect(moment(date, EventDateTime.dateFormat).isValid()).toBe(true);
    });
  });
});
