/* istanbul ignore file */
import 'module-alias/register';
import { schedule as createTask } from 'node-cron';
import { main } from '@/tasks';

if (process.env.NODE_ENV === 'production') {
  createTask('* * * * Friday', main);
}
