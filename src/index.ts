import * as express from 'express';
import { sanitizeSchedule, submitEvents } from './google/calendar';

const app = express();
const server = app.listen(process.env.PORT || '4003');

app.use(express.json()); // parsing of JSON request bodies
app.post('/schedule', ({ body }, res) => {
  try {
    const { schedule, 'start-date': start } = body;
    sanitizeSchedule(schedule, start)
      .then(submitEvents)
      .then(() => res.sendStatus(201))
      .catch(() => res.sendStatus(500));
  } catch (err) {
    res.sendStatus(400);
  }
});

export { app, server };
