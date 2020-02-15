import { google } from 'googleapis';
import moment from 'moment';
import { Chef, Event } from '@/models';
import { GoogleCalendarService } from '..';

jest.mock('twilio');
jest.mock('googleapis', () => {
  const mockAclInsert = jest.fn();
  const mockEventsInsert = jest.fn();
  const mockFreeBusyQuery = jest
    .fn()
    .mockResolvedValue({ data: { calendars: { 'hank-calendar': { busy: [] } } } });
  return {
    google: {
      auth: {
        GoogleAuth: class {
          getClient = () => ({ email: 'my service email' });
        },
      },
      calendar: () => ({
        acl: { insert: mockAclInsert },
        events: { insert: mockEventsInsert },
        freebusy: { query: mockFreeBusyQuery },
      }),
    },
  };
});

const mockAclInsert = google.calendar('v3').acl.insert as jest.Mock;
interface MockAclInsertArg {
  auth: { email: string };
  calendarId: string;
  requestBody: { role: 'writer'; scope: { type: 'user'; value: string } };
}

const mockEventsInsert = google.calendar('v3').events.insert as jest.Mock;
interface MockEventsInsertArg {
  auth: { email: string };
  calendarId: string;
  requestBody: Event;
}

const mockFreebusyQuery = google.calendar('v3').freebusy.query as jest.Mock;
interface MockFreebusyQueryArg {
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
    describe('static addWriteAccessUserToCalendar', () => {
      const calendarId = 'my-calendar';
      const email = '1337@gamer.com';

      beforeEach(async () => {
        await GoogleCalendarService.addWriteAccessUserToCalendar({ calendarId, email });
      });

      it('calls on GCal acl insert with JWT obtained from GoogleAuth instance', () => {
        mockAclInsert.mock.calls.forEach((call: [MockAclInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].auth).toStrictEqual({ email: 'my service email' });
        });
      });

      it('calls on GCal acl insert with passed-in calendarId and email', () => {
        mockAclInsert.mock.calls.forEach((call: [MockAclInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].calendarId).toBe(calendarId);
          expect(call[0].requestBody.scope.value).toBe(email);
        });
      });

      it('calls on GCal acl insert with role="writer" & scope.type="user"', () => {
        mockAclInsert.mock.calls.forEach((call: [MockAclInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].requestBody.role).toBe('writer');
          expect(call[0].requestBody.scope.type).toBe('user');
        });
      });
    });

    describe('static addEvents', () => {
      const events = [
        new Event({ summary: 'my event', start: moment() }),
        new Event({ summary: 'my other event', start: moment() }),
      ];

      beforeEach(async () => {
        await GoogleCalendarService.addEvents(events);
      });

      it('calls on GCal events insert with JWT obtained from GoogleAuth instance', () => {
        mockEventsInsert.mock.calls.forEach((call: [MockEventsInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].auth).toStrictEqual({ email: 'my service email' });
        });
      });

      it('calls on GCal events insert with default calendarId = "primary"', () => {
        mockEventsInsert.mock.calls.forEach((call: [MockEventsInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].calendarId).toBe('primary');
        });
      });

      it('calls on GCal events insert with passed-in calendarId', async () => {
        mockEventsInsert.mockClear();
        await GoogleCalendarService.addEvents(events, 'secondary');
        mockEventsInsert.mock.calls.forEach((call: [MockEventsInsertArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].calendarId).toBe('secondary');
        });
      });

      it('calls on GCal events insert only once for each passed-in event', () => {
        expect(mockEventsInsert).toHaveBeenCalledTimes(events.length);
        mockEventsInsert.mock.calls.forEach((call: [MockEventsInsertArg], i: number) => {
          expect(call).toHaveLength(1);
          expect(call[0].requestBody).toBe(events[i]);
        });
      });
    });

    describe('static queryAndSetChefsAvailabilityNextWeek', () => {
      const hank = new Chef({ name: 'Hank', email: '', phone: '', calendarId: 'hank-calendar' });
      const mary = new Chef({ name: 'Mary', email: '', phone: '', calendarId: 'mary-calendar' });

      const spySetAvailabilityNextWeekHank = jest.spyOn(hank, 'setAvailabilityNextWeek');
      const spySetAvailabilityNextWeekMary = jest.spyOn(mary, 'setAvailabilityNextWeek');

      beforeEach(async () => {
        await GoogleCalendarService.queryAndSetChefsAvailabilityNextWeek([hank, mary]);
      });

      it('calls on GCal freebusy query only once', () => {
        expect(mockFreebusyQuery).toHaveBeenCalledTimes(1);
      });

      it('calls on GCal freebusy query with JWT obtained from GoogleAuth instance', () => {
        mockFreebusyQuery.mock.calls.forEach((call: [MockFreebusyQueryArg]) => {
          expect(call).toHaveLength(1);
          expect(call[0].auth).toStrictEqual({ email: 'my service email' });
        });
      });

      it('sets availability of each chef', () => {
        expect(spySetAvailabilityNextWeekHank).toHaveBeenCalledTimes(1);
        expect(spySetAvailabilityNextWeekHank).toHaveBeenCalledWith([]);
        expect(spySetAvailabilityNextWeekMary).toHaveBeenCalledTimes(1);
        expect(spySetAvailabilityNextWeekMary).toHaveBeenCalledWith(undefined);
      });
    });
  });
});
