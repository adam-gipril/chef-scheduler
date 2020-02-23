/* istanbul ignore file */
/* eslint-disable no-console */
import 'module-alias/register';
import moment from 'moment';
import { schedule as createTask } from 'node-cron';
import { main } from '@/tasks';
import './app';

if (process.env.NODE_ENV === 'production') {
  console.log(`${moment().format()}: scheduling task "main"`);
  try {
    createTask('* * * * Friday', main);
    console.log('task created successfully');
  } catch (error) {
    console.error('failed to create task');
  }
}
