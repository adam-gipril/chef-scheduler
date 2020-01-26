import createClient from 'twilio';

/** Argument expected by TwilioService.sendSMS */
interface SendSMSArg {
  /** SMS message content */
  body: string;
  /** Target phone number to which SMS will be sent. Must include "+<country code>" */
  to: string;
}

/** Argument expected by TwilioService.sendGroupSMS */
interface SendGroupSMSArg {
  /** SMS message content */
  body: string;
  /**
   * Target group of phone numbers to which SMS will be sent.
   * Each number must include "+<country code>"
   */
  toGroup: string[];
}

/** Interface for Twilio's API */
export default class TwilioService {
  /** Client through which Twilio requests are made */
  private static readonly client = createClient(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
  /** Phone number from which chef-cal-integration SMS messages will be sent */
  private static readonly hostNumber = process.env.HOST_NUMBER;

  /** Send an SMS to a single phone number */
  static async sendSMS(sms: SendSMSArg) {
    // TODO handle errors and handle absence of, or invalid "to"
    return await this.client.messages.create({ ...sms, from: this.hostNumber });
  }

  /** Send the same SMS to a group of phone numbers */
  static async sendGroupSMS({ body, toGroup = [] }: SendGroupSMSArg) {
    // TODO handle errors and handle absence of toGroup
    const requests = toGroup.map(to => this.sendSMS({ body, to }).catch(error => error));
    return await Promise.all(requests);
  }
}
