import { Person } from '@/interfaces';
import { ChefSchedule } from '@/models';
import { GoogleCalendarService, TwilioService } from '@/services';

/**
 * Generate a chef schedule, add its events to Google
 * Calendar, and notify the group via SMS that the new schedule
 * is available
 */
export default async () => {
  try {
    const people = JSON.parse(process.env.PEOPLE) as Person[];
    const { events } = await ChefSchedule.generate();
    await GoogleCalendarService.addEvents(events);
    await TwilioService.sendGroupSMS({
      body:
        'A new Chef Schedule is available! Visit https://bit.ly/37bMa48 to see if/when you cook next week.',
      toGroup: people.map(person => person.phone),
    });
  } catch (error) {}
};
