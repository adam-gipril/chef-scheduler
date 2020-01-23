import request from 'supertest';
import { app, server } from '..';
import { Event, Schedule } from '@/models';
import { GoogleCalendarService } from '@/services';
import { capitalize } from '@/utils';

const fromScheduleDataSpy = jest.spyOn(Schedule, 'fromScheduleData');
const addEventsSpy = jest.spyOn(GoogleCalendarService, 'addEvents').mockResolvedValue();

const startDate = '2019-09-29';
const schedule = [
  { type: 'main', chef: 'Lloyd', day: 'SUN' },
  { type: 'side', chef: 'Harry', day: 'SUN' },
];
const scheduleData = {
  'start-date': startDate,
  schedule,
};

describe('express server', () => {
  afterAll(() => server.close());

  describe('endpoints', () => {
    describe('post /schedule', () => {
      describe('operations', () => {
        beforeAll(async () => {
          fromScheduleDataSpy.mockClear();
          addEventsSpy.mockClear();
          await request(app)
            .post('/schedule')
            .send(scheduleData);
        });

        it('constructs a schedule from the request body data', () => {
          expect(fromScheduleDataSpy).toHaveBeenCalledTimes(1);
          expect(fromScheduleDataSpy).toHaveBeenCalledWith(
            scheduleData.schedule,
            scheduleData['start-date'],
          );
        });

        it('calls on GoogleCalendarService to add events', () => {
          const [spiedEvents] = addEventsSpy.mock.calls[0];
          expect(addEventsSpy).toHaveBeenCalledTimes(1);
          spiedEvents.forEach((event, i) => {
            expect(event).toBeInstanceOf(Event);
            expect(event.start.date).toBe(startDate);
            expect(event.end.date).toBe(startDate);
            expect(event.summary).toBe(
              `${capitalize(schedule[i].type)} — ${capitalize(schedule[i].chef)}`,
            );
          });
        });
      });

      describe('response status', () => {
        let response: request.Response;

        beforeEach(() => {
          fromScheduleDataSpy.mockClear();
          addEventsSpy.mockClear();
        });

        it('responds with 400 "bad request" status to invalid requests', async () => {
          response = await request(app)
            .post('/schedule')
            .send();
          expect(response.status).toBe(400);
        });

        it('responds with 502 "bad gateway" status on failure from Google', async () => {
          fromScheduleDataSpy.mockImplementationOnce(() => ({} as any));
          addEventsSpy.mockRejectedValueOnce(new Error('error adding events'));
          response = await request(app).post('/schedule');
          expect(response.status).toBe(502);
        });

        it('responds with 201 "created" status when all is successful', async () => {
          response = await request(app)
            .post('/schedule')
            .send(scheduleData);
          expect(response.status).toBe(201);
        });
      });
    });
  });
});
