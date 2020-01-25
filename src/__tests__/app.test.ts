import request from 'supertest';
import { app, server } from '..';
import { Event, Schedule } from '@/models';
import { GoogleCalendarService } from '@/services';
import { capitalize } from '@/utils';

const spyFromScheduleItems = jest.spyOn(Schedule, 'fromScheduleItems');
const spyAddEvents = jest.spyOn(GoogleCalendarService, 'addEvents').mockResolvedValue();

const startDate = '2019-09-29';
const scheduleItems = [
  { type: 'Main', chef: 'Lloyd', day: 'SUN' },
  { type: 'Side', chef: 'Harry', day: 'SUN' },
];
const requestBody = {
  'start-date': startDate,
  schedule: scheduleItems,
};

describe('express server', () => {
  afterAll(() => server.close());

  describe('endpoints', () => {
    describe('post /schedule', () => {
      describe('operations', () => {
        beforeAll(async () => {
          spyFromScheduleItems.mockClear();
          spyAddEvents.mockClear();
          await request(app)
            .post('/schedule')
            .send(requestBody);
        });

        it('constructs a schedule from the request body', () => {
          expect(spyFromScheduleItems).toHaveBeenCalledTimes(1);
          expect(spyFromScheduleItems).toHaveBeenCalledWith(
            requestBody.schedule,
            requestBody['start-date'],
          );
        });

        it('calls on GoogleCalendarService to add events', () => {
          const [spiedEvents] = spyAddEvents.mock.calls[0];
          expect(spyAddEvents).toHaveBeenCalledTimes(1);
          spiedEvents.forEach((event, i) => {
            expect(event).toBeInstanceOf(Event);
            expect(event.start.date).toBe(startDate);
            expect(event.end.date).toBe(startDate);
            expect(event.summary).toBe(
              `${capitalize(scheduleItems[i].type)} — ${capitalize(scheduleItems[i].chef)}`,
            );
          });
        });
      });

      describe('response status', () => {
        let response: request.Response;

        beforeEach(() => {
          spyFromScheduleItems.mockClear();
          spyAddEvents.mockClear();
        });

        it('responds with 400 "bad request" status to invalid requests', async () => {
          response = await request(app)
            .post('/schedule')
            .send();
          expect(response.status).toBe(400);
        });

        it('responds with 502 "bad gateway" status on failure from Google', async () => {
          spyFromScheduleItems.mockImplementationOnce(() => ({} as any));
          spyAddEvents.mockRejectedValueOnce(new Error('error adding events'));
          response = await request(app).post('/schedule');
          expect(response.status).toBe(502);
        });

        it('responds with 201 "created" status when all is successful', async () => {
          response = await request(app)
            .post('/schedule')
            .send(requestBody);
          expect(response.status).toBe(201);
        });
      });
    });
  });
});
