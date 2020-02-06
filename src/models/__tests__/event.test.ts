import moment from 'moment';
import { Event, EventDateTime } from '..';

describe('model: Event', () => {
  const summary = 'my event';
  const start = moment();
  const end = moment().add(1, 'day');
  let event = new Event({ summary, start });

  describe('constructor', () => {
    it('sets the summary of the event', () => {
      expect(event.summary).toBe(summary);
    });

    it('assigns an EventDateTime to the start and end properties', () => {
      expect(event.start).toBeInstanceOf(EventDateTime);
      expect(event.end).toBeInstanceOf(EventDateTime);
    });

    it('sets the start date equal to the end date by default', () => {
      expect(event.start.date).toBe(start.format(EventDateTime.dateFormat));
      expect(event.start).toBe(event.end);
    });

    it('sets the passed-in end date', () => {
      event = new Event({ summary, start, end });
      expect(event.start.date).toBe(start.format(EventDateTime.dateFormat));
      expect(event.end.date).toBe(end.format(EventDateTime.dateFormat));
      expect(event.start).not.toBe(event.end);
    });
  });
});
