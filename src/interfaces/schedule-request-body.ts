import { ScheduleItem } from '.';

/** Shape of body expected on requests to /schedule */
export interface ScheduleRequestBody {
  /** Date of Sunday which starts the scheduled week */
  'start-date': string;
  /** Cooking event information */
  schedule: ScheduleItem[];
}
