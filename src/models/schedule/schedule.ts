import Event from '../event';

/** Maps day of the week to 0–6 numeric value */
export enum days {
  SUN,
  MON,
  TUE,
  WED,
  THU,
  FRI,
  SAT,
}

/** Represents a collection of Google Calendar events */
export default abstract class Schedule {
  constructor(public events: Event[]) {}
}
