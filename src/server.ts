import * as express from 'express';
import * as calendarService from '@/services/calendar';
import { Schedule } from '@/models';

const app = express();
const server = app.listen(process.env.PORT || '4003');

app.use(express.json()); // parsing of JSON request bodies
app.post('/schedule', async ({ body }, res) => {
  try {
    const { schedule: scheduleData, 'start-date': start } = body;
    const schedule = Schedule.fromScheduleData(scheduleData, start);
    try {
      await calendarService.submitEvents(schedule.events);
      res.sendStatus(201);
    } catch (err) {
      res.sendStatus(502);
    }
  } catch (err) {
    res.sendStatus(400);
  }
});

export { app, server };
