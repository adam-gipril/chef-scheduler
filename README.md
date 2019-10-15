# Chef Cal Integration

> My friends and I cook dinner almost every night. One of us cooks a main dish, and someone else
> cooks a side.
>
> — <cite>Zana Jipsen</cite>

Zana very kindly developed a Python application called
[Chef Scheduler](https://github.com/zjipsen/chef-scheduler) for scheduling each of us to cook on
days we're available, and with an extra degree of intelligence in favoring chefs who haven't cooked
in a while. The Python application sends out schedule updates once weekly via text message.

Because text conversations can be easily buried and difficult to resurface, it would be convenient
to also glance at the schedule in a Calendar view. Additionally, calendar integration means the
built-in notification support already in place on most calendars can be leveraged for more easily-
and personally-configured push notifications when it's your time to cook.

This Node/Express application accepts POST requests from the scheduler, and converts the schedule
into Google Calendar events.

## Table of Contents

1. [API](#api)
1. [Developing](#developing)
1. [Documentation](#documentation)
1. [Deploying](#deploying)
1. [Contributing](#contributing)
1. [Links](#links)

## API

### Endpoint: `/schedule`

#### Method: `POST`

#### Parameters:
Field | Type | Required/Optional | Description
------|------|-------------------|------------
start-date | string | Required | Date of the Sunday which starts the scheduled week
schedule | array of `ScheduleData` objects | Required | Cooking event information

where a `ScheduleData` object consists of

Field | Type | Required/Optional | Description | Allowed Values
------|------|-------------------|-------------|------------
type | string | Required | Type of meal the chef is cooking | `main`, `side`
chef | string | Required | Name of the person cooking
day | string | Required | Day of the week on which cooking event occurs | `SUN`, `MON`, `TUE`, `WED`, `THU`

### Example
```
{
  "start-date": "9/29/2019",
  "schedule":  [
      {
        "type": "main",
        "chef": "Zana",
        "day": "SUN"
      },
  ]
}
```

## Developing

### Prerequisites

* [Node.js](https://nodejs.org/en/download/) (12.4.x)
* [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md)
* [NPM](https://www.npmjs.com)

### Cloning the project and installing dependencies

```bash
git clone https://github.com/bikeshaman/chef-cal-integration.git
cd chef-cal-integration
nvm install
npm install
```

### Compiling

This project is written in TypeScript, and therefore needs to be compiled before it can be run by
Node.js. To compile the project, run:

```bash
npm run build       # compiles the project
npm run build:watch # compiles the project and watches for changes
```

### Authentication

This application is configured to work with Google service accounts having the
[Google Calendar API](https://developers.google.com/calendar) enabled.

Requests to the API are authenticated using OAuth 2.0, with credentials loaded from the
`CREDENTIALS` environment variable. The environment variable needs to be set on your machine or the
deployment instance, and its value should be the stringified `credentials.json` object obtained
through the [Google Cloud Platform console](https://console.cloud.google.com/) for your service
account.

For more information on OAuth 2.0, Google service accounts, and obtaining the requisite credentials
to make successful requests, see
[Using OAuth 2.0 for Server to Server Applications](https://developers.google.com/identity/protocols/OAuth2ServiceAccount).

### Running the server

The server can be started using one of the following commands. Port 4003 is default, and can be
overridden by preceding either command with `PORT=<desired port>`.

```bash
npm start           # runs the server
npm run start:watch # runs the server using nodemon to watch for changes
```

## Documentation

Each method, class, and interface definition is documented using [JSDoc](https://devdocs.io/jsdoc/)
syntax. Many IDEs are capable of generating hover-over documentation on-the-fly from JSDoc syntax.

To compile a navigable documentation resource and open it in your default browser, be sure to first
[compile the project](#compiling) then run:

```bash
npm run docs
```

## Deploying

This application is deployed on [Heroku](https://www.heroku.com/). A webhook is in place to
automatically update the deployment any time a change is committed to `master` on the GitHub repo.
Google credentials are set with a config var through the Heroku dashboard or CLI.

I'm currently the only individual with access to the deployment, so please get in touch with any
questions or requests regarding the deploy.

## Contributing

With the webhook in place to automatically deploy any committed changes to `master`, please
contribute via a feature branch and pull request. That being said, it's pretty low stakes if
something fails on this service, so no big deal.

## Links

* [Chef Scheduler](https://github.com/zjipsen/chef-scheduler)
* [Chef Cal Integration](https://github.com/bikeshaman/chef-cal-integration)
* [Google Calendar API](https://developers.google.com/calendar)
* [Using OAuth 2.0 for Server to Server Applications](https://developers.google.com/identity/protocols/OAuth2ServiceAccount)
* [Node.js](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com)
* [Nodemon](https://nodemon.io/)
* [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md)
* [JSDoc](https://devdocs.io/jsdoc/)
