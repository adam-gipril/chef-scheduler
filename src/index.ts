import * as express from 'express';
import calendar from './google/calendar';

const app = express();
const server = app.listen(process.env.PORT || '4003');

app.use(express.json());
app.post('/schedule', ({ body }, res) => {
  try {
    const { 'start-date': start, schedule } = body;
    calendar.createEvents(start, schedule)
      .then(calendar.submitEvents)
      .then(() => res.sendStatus(201))
      .catch(() => res.sendStatus(500));
  } catch (err) {
    res.sendStatus(400);
  }
});

export { app, server };
