import { Person } from '@/interfaces';
import { ChefSchedule } from '@/models';
import { GoogleCalendarService, TwilioService } from '@/services';
import * as Tasks from '..';

const { main } = Tasks;
const spyMain = jest.spyOn(Tasks, 'main');

const mockChefSchedule = { events: [] };

const spyChefScheduleGenerate = jest
  .spyOn(ChefSchedule, 'generate')
  .mockResolvedValue(mockChefSchedule);

const spyGoogleCalendarServiceAddEvents = jest
  .spyOn(GoogleCalendarService, 'addEvents')
  .mockResolvedValue();

const spyTwilioServiceSendGroupSMS = jest
  .spyOn(TwilioService, 'sendGroupSMS')
  .mockResolvedValue([]);

const people: Person[] = [{ name: 'Mary', email: '', phone: '15554201337', calendarId: '' }];

describe('task: main', () => {
  let PEOPLE: string;

  beforeAll(() => {
    PEOPLE = process.env.PEOPLE;
    process.env.PEOPLE = JSON.stringify(people);
  });

  afterAll(() => {
    process.env.PEOPLE = PEOPLE;
  });

  beforeEach(async () => {
    await main();
  });

  it('generates a ChefSchedule', () => {
    expect(spyChefScheduleGenerate).toHaveBeenCalledTimes(1);
  });

  it('adds outputted events to Google Calendar', () => {
    expect(spyGoogleCalendarServiceAddEvents).toHaveBeenCalledTimes(1);
    expect(spyGoogleCalendarServiceAddEvents).toHaveBeenCalledWith(mockChefSchedule.events);
  });

  it('sends an SMS to the group indicating schedule is ready', () => {
    expect(spyTwilioServiceSendGroupSMS).toHaveBeenCalledTimes(1);
  });

  it('does not throw errors from any of the services', () => {
    spyChefScheduleGenerate.mockRejectedValueOnce(new Error('my error'));
    expect(spyMain).not.toThrow();
  });
});
