import express from 'express';
import { schedule as createTask } from 'node-cron';
import { Person, ScheduleRequestBody } from '@/interfaces';
import { ChefSchedule } from '@/models';
import { GoogleCalendarService, TwilioService } from '@/services';

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

if (process.env.NODE_ENV === 'production') {
  createTask('* * * * Friday', async () => {
    try {
      const people = JSON.parse(process.env.PEOPLE) as Person[];
      const { events } = await ChefSchedule.generate();
      await GoogleCalendarService.addEvents(events);
      await TwilioService.sendGroupSMS({
        body:
          'A new Chef Schedule is available! Visit https://bit.ly/37bMa48 to see if/when you cook next week.',
        toGroup: people.map(person => person.phone),
      });
    } catch (error) {}
  });
}

export default app;
