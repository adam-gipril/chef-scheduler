import * as express from 'express';
import { createEvents, submitEvents } from './google/calendar';

const app = express();
const server = app.listen(process.env.PORT || '4003');

app.use(express.json());
app.post('/schedule', ({ body }, res) => {
  try {
    const { 'start-date': start, schedule } = body;
    createEvents(start, schedule)
      .then(submitEvents)
      .then(() => res.sendStatus(201))
      .catch(() => res.sendStatus(500));
  } catch (err) {
    res.sendStatus(400);
  }
});

export { app, server };
