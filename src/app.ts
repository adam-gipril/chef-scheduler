import express from 'express';
import { schedule as createTask } from 'node-cron';
import { ScheduleRequestBody } from '@/interfaces';
import { ChefSchedule } from '@/models';
import { GoogleCalendarService } from '@/services';
import { main } from '@/tasks';

const app = express();

app.use(express.json()); // parsing of JSON request bodies
app.post('/schedule', async ({ body }, res) => {
  try {
    const { schedule: scheduleItems, 'start-date': start } = body as ScheduleRequestBody;
    const { events } = ChefSchedule.fromScheduleItems(scheduleItems, start);
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

/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
  createTask('* * * * Friday', main);
}

export default app;
