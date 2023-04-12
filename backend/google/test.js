const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {google} = require('googleapis');

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  } else {
    throw new Error('No credentials found. Please run create_token.js first.');
  }
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    // timeMin: new Date().toISOString(),
    // maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  return events;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
}

async function createEvent(auth, event) {
  const calendar = google.calendar({version: 'v3', auth});
  await calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  }, function (err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
  });
}

async function createEmail(auth, email) {
  const people = google.people({version: 'v1', auth});
  const pres = await people.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses',
  });
  const address = pres.data.emailAddresses.find(e => e.metadata.primary).value;

  const gmail = google.gmail({version: 'v1', auth});
  const messageParts = [
    `From: Booking System <${address}>`,
    `To: ${email.name} <${email.address}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${email.subject}`,
    '',
    `${email.message}`
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    }
  });

  console.log(res.data);
  return res.data;
}

const addEvent = (event) => authorize().then((auth) => createEvent(auth, event)).catch(console.error);
const sendEmail = (email) => authorize().then((auth) => createEmail(auth, email)).catch(console.error);
const getEvents = () => authorize().then(listEvents).catch(console.error);

module.exports = {
  addEvent,
  sendEmail,
  getEvents
}

const test = async () => {
  let r;
  r = await sendEmail({
    name: 'person',
    address: 'person@utoronto.ca',
    subject: 'Booking confirmed',
    message: 'Booking confirmed'
  });
  console.log(r)

  r = await addEvent({
    'summary': 'HB 00000000000000000000000000 Title',
    'location': 'DH2014',
    'description': 'description reason',
    'start': {
      'dateTime': `${(new Date(Date.now())).toISOString()}`,
      'timeZone': 'America/Toronto',
    },
    'end': {
      'dateTime': `${(new Date(Date.now() + (2 * 60 * 60 * 1000))).toISOString()}`,
      'timeZone': 'America/Toronto',
    }
  });
  console.log(r)

  r = await getEvents();
  console.log(r)
}

// test();