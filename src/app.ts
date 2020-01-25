import express from 'express';
import { ScheduleRequestBody } from '@/interfaces';
import { Schedule } from '@/models';
import { GoogleCalendarService } from '@/services';

const app = express();

app.use(express.json()); // parsing of JSON request bodies
app.post('/schedule', async ({ body }, res) => {
  try {
    const { schedule: scheduleItems, 'start-date': start } = body as ScheduleRequestBody;
    const { events } = Schedule.fromScheduleItems(scheduleItems, start);
    try {
      await GoogleCalendarService.addEvents(events);
      res.sendStatus(201);
    } catch (err) {
      res.sendStatus(502);
    }
  } catch (err) {
    res.sendStatus(400);
  }
});

export default app;
