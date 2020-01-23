import express from 'express';
import { Schedule } from '@/models';
import { GoogleCalendarService } from '@/services';

const app = express();

app.use(express.json()); // parsing of JSON request bodies
app.post('/schedule', async ({ body }, res) => {
  try {
    // TODO typing on request body
    const { schedule: scheduleData, 'start-date': start } = body;
    const schedule = Schedule.fromScheduleData(scheduleData, start);
    try {
      await GoogleCalendarService.addEvents(schedule.events);
      res.sendStatus(201);
    } catch (err) {
      res.sendStatus(502);
    }
  } catch (err) {
    res.sendStatus(400);
  }
});

export default app;
