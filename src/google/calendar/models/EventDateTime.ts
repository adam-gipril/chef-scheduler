import { calendar_v3 as calendarV3 } from 'googleapis/build/src/apis/calendar/v3';

const formatMonth = (month: number): string => (month < 9 ? `0${month + 1}` : `${month + 1}`);
const formatDay = (day: number): string => (day < 10 ? `0${day}` : `${day}`);

export default class EventDateTime implements calendarV3.Schema$EventDateTime {
  date: string;

  constructor(date: Date) {
    this.setDate(date);
  }

  private setDate(date: Date) {
    const yyyy = date.getFullYear();
    const mm = formatMonth(date.getMonth());
    const dd = formatDay(date.getDate());
    this.date = `${yyyy}-${mm}-${dd}`;
  }
}
