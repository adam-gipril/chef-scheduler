import moment from 'moment';
import { Person } from '@/interfaces';
import EventDateTime from './event-date-time';
import Event from './event';

export default class Chef implements Person {
  name: string;
  email: string;
  phone: string;
  calendarId: string;

  exclusions: Event[];

  get excludedDaysNextWeek() {
    return this.exclusions.reduce((days, { start, end }) => {
      const startDay = moment(start.date, EventDateTime.dateFormat).day() + 7;
      const endDay = moment(end.date, EventDateTime.dateFormat).day() + 7;
      if (startDay === endDay) {
        days.push(startDay);
      } else {
        for (let day = startDay; day <= endDay; day++) {
          days.push(day);
        }
      }
      return days;
    }, [] as number[]);
  }

  score?: number; // TODO score will depend on cooking history

  constructor(person: Person, exclusions = [] as Event[]) {
    Object.assign(this, person);
    this.exclusions = exclusions;
  }
}
