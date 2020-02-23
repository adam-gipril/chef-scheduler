import Event from '../event';

/** Represents a collection of Google Calendar events */
export default abstract class Schedule {
  constructor(public events: Event[]) {}
}
