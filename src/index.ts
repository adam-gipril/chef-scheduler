/* istanbul ignore file */
import 'module-alias/register';
import moment from 'moment';
import { schedule as createTask } from 'node-cron';
import { main } from '@/tasks';

if (process.env.NODE_ENV === 'production') {
  /* eslint-disable-next-line */
  console.log(`${moment().format()}: scheduling task "main"`);
  createTask('* * * * Friday', main);
}
