/** Interface for schedule entries submitted to the chef-cal-integration API. */
export interface ScheduleItem {
  /** Type of meal the chef will cook */
  type: 'Main' | 'Side';
  /** Name of person cooking */
  chef: string;
  /** Day of the week on which cooking event falls (three-letter abbreviation) */
  day: string;
}
