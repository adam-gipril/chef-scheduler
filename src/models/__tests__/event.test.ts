import moment from 'moment';
import { Event, EventDateTime } from '..';

describe('model: Event', () => {
  const summary = 'my event';
  const date = moment().toDate();
  const event = new Event({ summary, date });

  describe('constructor', () => {
    it('sets the summary of the event', () => {
      expect(event.summary).toBe(summary);
    });

    it('assigns an EventDateTime to the start and end properties', () => {
      expect(event.start).toBeInstanceOf(EventDateTime);
      expect(event.end).toBeInstanceOf(EventDateTime);
    });

    it('sets the start date equal to the end date', () => {
      expect(event.start).toBe(event.end);
    });
  });
});
