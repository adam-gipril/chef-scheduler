import createClient from 'twilio';
import { TwilioService } from '..';

jest.mock('twilio', () => {
  const mockCreate = jest.fn();
  return () => ({
    messages: { create: mockCreate },
  });
});

const mockCreate = createClient().messages.create as jest.Mock;
// TODO make better use of the invalid messages to improve implementation
const messages = {
  valid: [
    { body: 'my first message', to: '+14205551337' },
    { body: 'my second message', toGroup: ['+14205551337', '+14205556969'] },
  ],
  invalid: [{ to: '+14205551337' }, { to: '+344205551337' }, { body: 'message without "to"' }],
} as any;

describe('service: TwilioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('methods', () => {
    describe('static sendSMS', () => {
      it('calls on Twilio to "create" message', async () => {
        const [sms] = messages.valid;
        await TwilioService.sendSMS(sms);
        expect(mockCreate).toHaveBeenCalledTimes(1);
        expect(mockCreate.mock.calls[0][0]).toMatchObject(sms);
      });

      it('rejects error when Twilio rejects', async () => {
        const [sms] = messages.invalid as any[];
        mockCreate.mockRejectedValueOnce(new Error('I reject you!!'));
        await expect(TwilioService.sendSMS(sms)).rejects.toThrow('I reject you!!');
      });
    });

    describe('static sendGroupSMS', () => {
      it('calls on Twilio to "create" message for each passed-in recipient', async () => {
        const [, sms] = messages.valid;
        await TwilioService.sendGroupSMS(sms);
        expect(mockCreate).toHaveBeenCalledTimes(sms.toGroup.length);
        mockCreate.mock.calls.forEach((call, i) => {
          const [{ body, to }] = call;
          expect(body).toBe(sms.body);
          expect(to).toBe(sms.toGroup[i]);
        });
      });

      it('returns results when all Twilio calls are successful', async () => {
        const [, sms] = messages.valid;
        const resolvedValues = [{ sid: 'beans' }, { sid: 'beans 2' }];
        mockCreate
          .mockResolvedValueOnce(resolvedValues[0])
          .mockResolvedValueOnce(resolvedValues[1]);
        const responses = await TwilioService.sendGroupSMS(sms);
        responses.forEach((response, i) => expect(response).toStrictEqual(resolvedValues[i]));
      });

      it('returns errors when all Twillio calls are unsuccessful', async () => {
        const [, sms] = messages.valid;
        const rejectedValues = [{ sid: 'beans', message: 'error beans!?' }, { sid: 'beans 2' }];
        mockCreate
          .mockRejectedValueOnce(rejectedValues[0])
          .mockRejectedValueOnce(rejectedValues[1]);
        const responses = await TwilioService.sendGroupSMS(sms);
        responses.forEach((response, i) => expect(response).toStrictEqual(rejectedValues[i]));
      });

      it('returns mix of results and errors when Twilio calls have mixed success', async () => {
        const [, sms] = messages.valid;
        const mixedValues = [{ sid: 'will be resolved' }, { sid: 'will be rejected' }];
        mockCreate.mockResolvedValueOnce(mixedValues[0]).mockRejectedValueOnce(mixedValues[1]);
        const responses = await TwilioService.sendGroupSMS(sms);
        responses.forEach((response, i) => expect(response).toStrictEqual(mixedValues[i]));
      });
    });
  });
});
