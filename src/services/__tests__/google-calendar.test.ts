import { google } from 'googleapis';
import { GoogleCalendarService } from '..';
import { Event } from '@/models';

jest.mock('twilio');
jest.mock('googleapis', () => {
  const mockInsert = jest.fn();
  return {
    google: {
      auth: {
        GoogleAuth: class {
          getClient = () => ({ email: 'my service email' });
        },
      },
      calendar: () => ({ events: { insert: mockInsert } }),
    },
  };
});

const mockInsert = google.calendar('v3').events.insert as jest.Mock;
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
        await GoogleCalendarService.addEvents(events);
      });

      it("calls on GCal insert with JWT obtained from service's GoogleAuth instance", () => {
        mockInsert.mock.calls.forEach((call: [MockInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].auth).toStrictEqual({ email: 'my service email' });
        });
      });

      it('calls on GCal insert with default calendarId = "primary"', () => {
        mockInsert.mock.calls.forEach((call: [MockInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].calendarId).toBe('primary');
        });
      });

      it('calls on GCal insert with passed-in calendarId', async () => {
        mockInsert.mockClear();
        await GoogleCalendarService.addEvents(events, 'secondary');
        mockInsert.mock.calls.forEach((call: [MockInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].calendarId).toBe('secondary');
        });
      });

      it('calls on GCal insert once for each passed-in event', () => {
        expect(mockInsert).toHaveBeenCalledTimes(events.length);
        mockInsert.mock.calls.forEach((call: [MockInsertArg], i: number) => {
          expect(call).toHaveLength(1);
          expect(call[0].requestBody).toBe(events[i]);
        });
      });
    });
  });
});
