/** Interface for schedule entries submitted to the chef-cal-integration API. */
export interface ScheduleItem {
  type: 'main' | 'side';
  chef: string;
  day: string;
}
