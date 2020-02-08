import { google } from 'googleapis';
import moment from 'moment';
import { Chef, Event } from '@/models';
import { GoogleCalendarService } from '..';

jest.mock('twilio');
jest.mock('googleapis', () => {
  const mockInsert = jest.fn();
  const mockQuery = jest.fn().mockResolvedValue({
    data: {
      calendars: {
        'hank-calendar': { busy: [] },
        'mary-calendar': { busy: [] },
      },
    },
  });
  return {
    google: {
      auth: {
        GoogleAuth: class {
          getClient = () => ({ email: 'my service email' });
        },
      },
      calendar: () => ({ events: { insert: mockInsert }, freebusy: { query: mockQuery } }),
    },
  };
});

const mockInsert = google.calendar('v3').events.insert as jest.Mock;
interface MockInsertArg {
  auth: { email: string };
  calendarId: string;
  requestBody: Event;
}

const mockQuery = google.calendar('v3').freebusy.query as jest.Mock;
interface MockQueryArg {
  auth: { email: string };
  requestBody: {
    items: { id: string }[];
    timeMax: string;
    timeMin: string;
    timeZone: string;
  };
}

describe('service: GoogleCalendarService', () => {
  describe('methods', () => {
    describe('static addEvents', () => {
      const events = [
        new Event({ summary: 'my event', start: moment() }),
        new Event({ summary: 'my other event', start: moment() }),
      ];

      beforeEach(async () => {
        await GoogleCalendarService.addEvents(events);
      });

      it('calls on GCal events insert with JWT obtained from GoogleAuth instance', () => {
        mockInsert.mock.calls.forEach((call: [MockInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].auth).toStrictEqual({ email: 'my service email' });
        });
      });

      it('calls on GCal events insert with default calendarId = "primary"', () => {
        mockInsert.mock.calls.forEach((call: [MockInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].calendarId).toBe('primary');
        });
      });

      it('calls on GCal events insert with passed-in calendarId', async () => {
        mockInsert.mockClear();
        await GoogleCalendarService.addEvents(events, 'secondary');
        mockInsert.mock.calls.forEach((call: [MockInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].calendarId).toBe('secondary');
        });
      });

      it('calls on GCal events insert only once for each passed-in event', () => {
        expect(mockInsert).toHaveBeenCalledTimes(events.length);
        mockInsert.mock.calls.forEach((call: [MockInsertArg], i: number) => {
          expect(call).toHaveLength(1);
          expect(call[0].requestBody).toBe(events[i]);
        });
      });
    });

    describe('static queryChefsAvailabilityNextWeek', () => {
      const chefs = [
        new Chef({ name: 'Hank', email: '', phone: '', calendarId: 'hank-calendar' }),
        new Chef({ name: 'Mary', email: '', phone: '', calendarId: 'mary-calendar' }),
      ];

      const chefsAvailabilitySpies = chefs.map(chef => jest.spyOn(chef, 'setAvailabilityNextWeek'));

      beforeEach(async () => {
        await GoogleCalendarService.queryChefsAvailabilityNextWeek(chefs);
      });

      it('calls on GCal freebusy query only once', () => {
        expect(mockQuery).toHaveBeenCalledTimes(1);
      });

      it('calls on GCal freebusy query with JWT obtained from GoogleAuth instance', () => {
        mockQuery.mock.calls.forEach((call: [MockQueryArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].auth).toStrictEqual({ email: 'my service email' });
        });
      });

      it('sets availability of each chef', () => {
        chefsAvailabilitySpies.forEach(spy => {
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith([]);
        });
      });
    });
  });
});
