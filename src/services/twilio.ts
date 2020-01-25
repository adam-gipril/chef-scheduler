import createClient from 'twilio';

/** Arguments expected to TwilioService SMS send methods */
interface SendSMSArgs {
  /** SMS message content */
  body: string;
  /** Target phone number to which SMS will be sent */
  to?: string;
  /** Target group of phone numbers to which SMS will be sent */
  toGroup?: string[];
}

/** Interface for Twilio's API */
export default class TwilioService {
  /** Client through which Twilio requests are made */
  private static client = createClient(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
  /** Phone number from which chef-cal-integration SMS messages will be sent */
  private static hostNumber = process.env.HOST_NUMBER;

  /** Send an SMS to a single phone number */
  static async sendSMS({ body, to }: SendSMSArgs) {
    // TODO handle errors
    const sms = await this.client.messages.create({ body, to, from: this.hostNumber });
    return sms;
  }

  /** Send the same SMS to a group of phone numbers */
  static async sendGroupSMS({ body, toGroup = [] }: SendSMSArgs) {
    // TODO handle errors
    const requests = toGroup.map(to => this.sendSMS({ body, to }));
    const messages = await Promise.all(requests);
    return messages;
  }
}
