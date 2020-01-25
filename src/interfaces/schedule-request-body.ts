import { ScheduleItem } from '.';

/** Shape of body expected on requests to /schedule */
export interface ScheduleRequestBody {
  'start-date': string;
  schedule: ScheduleItem[];
}
