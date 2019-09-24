// import { google } from 'googleapis';
import client from '../auth';

// const calendar = google.calendar('v3');

async function main() {
  const auth = await client;
  return auth;
}

main();
