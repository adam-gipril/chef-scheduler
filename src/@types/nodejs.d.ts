declare namespace NodeJS {
  export interface ProcessEnv {
    /** Twilio account SID */
    readonly ACCOUNT_SID: string;
    /** Twilio auth token */
    readonly AUTH_TOKEN: string;
    /** Phone number from which chef-cal-integration SMS messages will be sent */
    readonly HOST_NUMBER: string;
    /** Array of people used until a DB solution becomes necessary */
    readonly PEOPLE: string;
    /** Credentials to authenticate as a Google service account */
    readonly CREDENTIALS: string;
    /** Current runtime environment */
    readonly NODE_ENV: string;
    /** Port at which the express app will listen */
    readonly PORT: string;
  }
}
