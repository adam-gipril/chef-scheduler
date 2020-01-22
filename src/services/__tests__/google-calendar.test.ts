import { GoogleCalendarService } from '..';
import { Event } from '@/models';

const insert = jest.fn();
jest.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: class {
        getClient = () => ({ email: 'my service email' });
      },
    },
    calendar: () => ({ events: { insert } }),
  },
}));

interface MockInsertArg {
  auth: { email: string };
  calendarId: string;
  requestBody: Event;
}

describe('service: GoogleCalendarService', () => {
  describe('methods', () => {
    describe('static addEvents', () => {
      const events = [
        new Event({ summary: 'my event', date: new Date() }),
        new Event({ summary: 'my other event', date: new Date() }),
      ];

      beforeEach(async () => {
        jest.clearAllMocks();
        await GoogleCalendarService.addEvents(events);
      });

      it("calls on GCal insert with JWT obtained from service's GoogleAuth instance", () => {
        insert.mock.calls.forEach((call: [MockInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].auth).toStrictEqual({ email: 'my service email' });
        });
      });

      it('calls on GCal insert with default calendarId = "primary"', () => {
        insert.mock.calls.forEach((call: [MockInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].calendarId).toBe('primary');
        });
      });

      it('calls on GCal insert with passed-in calendarId', async () => {
        insert.mockClear();
        await GoogleCalendarService.addEvents(events, 'secondary');
        insert.mock.calls.forEach((call: [MockInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].calendarId).toBe('secondary');
        });
      });

      it('calls on GCal insert once for each passed-in event', () => {
        expect(insert).toHaveBeenCalledTimes(events.length);
        insert.mock.calls.forEach((call: [MockInsertArg], i: number) => {
          expect(call).toHaveLength(1);
          expect(call[0].requestBody).toBe(events[i]);
        });
      });
    });
  });
});
