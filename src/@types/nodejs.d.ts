declare namespace NodeJS {
  export interface ProcessEnv {
    /** Credentials to authenticate as a Google service account */
    readonly CREDENTIALS: string;
    /** Port at which the express app will listen */
    readonly PORT: string;
  }
}
